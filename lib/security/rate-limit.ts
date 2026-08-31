import { headers } from "next/headers";

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
