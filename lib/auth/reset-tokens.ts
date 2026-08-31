import { createHash, randomBytes } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * Password-reset tokens — interim implementation.
 *
 * Same JSON-file storage as the user and order stores, and the same caveat:
 * this does not survive serverless hosting. Firestore with a TTL policy is the
 * real home (CLAUDE.md §4).
 *
 * Only the SHA-256 *hash* of each token is stored. The raw token exists once,
 * in the email we send, so a leaked `.data` directory cannot be used to seize
 * accounts. Tokens are single-use and expire after an hour.
 */
/**
 * Password-reset tokens in Firestore, keyed by the SHA-256 hash of the token.
 *
 * Keying by the hash means redemption is a direct document lookup rather than
 * a scan, and the raw token still exists only in the email we send — a leaked
 * database cannot be used to seize accounts.
 */
const COLLECTION = "resetTokens";
const TTL_MS = 60 * 60 * 1000; // one hour

type ResetToken = {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

function col() {
  return getAdminDb().collection(COLLECTION);
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function isLive(t: ResetToken, now: number): boolean {
  return !t.usedAt && Date.parse(t.expiresAt) > now;
}

/**
 * Issues a token for a user and returns the raw value — the only time it
 * exists in plaintext. Any earlier token for the same user is dropped, so a
 * second "forgot password" click invalidates the first email.
 */
export async function createResetToken(userId: string): Promise<string> {
  const raw = randomBytes(32).toString("base64url");
  const now = Date.now();

  // A second "forgot password" click must invalidate the first email.
  const prior = await col().where("userId", "==", userId).get();
  const batch = getAdminDb().batch();
  for (const doc of prior.docs) batch.delete(doc.ref);

  const token: ResetToken = {
    tokenHash: hashToken(raw),
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
    usedAt: null,
  };
  batch.set(col().doc(token.tokenHash), token);
  await batch.commit();

  return raw;
}


/** True when the token is live — used to decide whether to show the form. */
export async function peekResetToken(raw: string): Promise<boolean> {
  if (!raw) return false;
  const doc = await col().doc(hashToken(raw)).get();
  if (!doc.exists) return false;
  return isLive(doc.data() as ResetToken, Date.now());
}


/**
 * Spends a token and returns the user it belongs to, or null when it is
 * unknown, already used, or expired. The delete happens inside a transaction
 * with the read, so a token cannot be redeemed twice concurrently.
 */
export async function consumeResetToken(raw: string): Promise<string | null> {
  if (!raw) return null;
  const db = getAdminDb();

  return db.runTransaction(async (tx) => {
    const ref = col().doc(hashToken(raw));
    const doc = await tx.get(ref);
    if (!doc.exists) return null;

    const token = doc.data() as ResetToken;
    if (!isLive(token, Date.now())) return null;

    // Single use: the row goes away rather than being flagged.
    tx.delete(ref);
    return token.userId;
  });
}
