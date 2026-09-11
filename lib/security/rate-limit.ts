import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * In-process rate limiter for unauthenticated endpoints (login, order
 * creation).
 *
 * Counters live in this process only, so on serverless each instance keeps its
 * own — this is a speed bump against scripted abuse, not a hard quota. The real
 * guarantees are the auth checks in the handlers themselves.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Caller identity: first hop of x-forwarded-for, else a shared bucket. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

export function consume(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Clears a bucket — call after a success so one good login resets the count. */
export function reset(key: string): void {
  buckets.delete(key);
}

/* ---------------------------------------------------------------------------
 * Shared counters
 *
 * The map above lives in one process. On serverless that is one instance of
 * however many are running, so a caller who lands on a fresh instance starts
 * from zero and the limit is worth a fraction of what it says (CD-RL-01).
 * These counters live in Firestore instead, so every instance is counting the
 * same attempts.
 *
 * The in-process bucket is still consulted first: it is free, it catches a
 * burst hitting one instance without a round trip, and it means Firestore is
 * only asked about callers who are still under the local limit.
 * ------------------------------------------------------------------------ */

const SHARED = "rateLimits";

function sharedRef(key: string) {
  // Hashed because a key holds an IP and an email address, and a document id
  // is not the place for either.
  return getAdminDb().collection(SHARED).doc(createHash("sha256").update(key).digest("hex"));
}

/**
 * Counts one attempt against every instance's shared view of `key`.
 *
 * Falls back to the local bucket if Firestore cannot be reached: a limiter is
 * a speed bump, and failing the sign-in of every customer because a counter
 * could not be written would be the worse outcome.
 */
export async function consumeShared(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const local = consume(key, limit, windowMs);
  if (!local.ok) return local;

  try {
    const db = getAdminDb();
    const ref = sharedRef(key);
    return await db.runTransaction(async (tx) => {
      const now = Date.now();
      const doc = await tx.get(ref);
      const data = doc.exists ? (doc.data() as { count: number; resetAt: number }) : null;

      // `expiresAt` is written as a real date so a Firestore TTL policy on that
      // field can sweep spent windows; nothing reads it.
      if (!data || data.resetAt <= now) {
        const resetAt = now + windowMs;
        tx.set(ref, { count: 1, resetAt, expiresAt: new Date(resetAt) });
        return { ok: true, retryAfterSec: 0 };
      }

      const count = data.count + 1;
      tx.set(ref, { count, resetAt: data.resetAt, expiresAt: new Date(data.resetAt) });
      if (count > limit) {
        return { ok: false, retryAfterSec: Math.ceil((data.resetAt - now) / 1000) };
      }
      return { ok: true, retryAfterSec: 0 };
    });
  } catch (err) {
    console.error("[rate-limit] shared counter unavailable, using local only", err);
    return local;
  }
}

/** Clears both counters — call after a success so one good login resets them. */
export async function resetShared(key: string): Promise<void> {
  reset(key);
  try {
    await sharedRef(key).delete();
  } catch (err) {
    console.error("[rate-limit] could not clear shared counter", err);
  }
}
