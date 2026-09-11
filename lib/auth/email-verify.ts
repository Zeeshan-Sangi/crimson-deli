import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION = "emailVerifyCodes";
const TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

type EmailVerifyCode = {
  codeHash: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  attempts: number;
};

function col() {
  return getAdminDb().collection(COLLECTION);
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function sha256(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * The row for an address, found without knowing the code.
 *
 * The document used to be keyed by the hash of the correct code, which meant a
 * wrong guess looked up a document that did not exist: the attempt counter sat
 * at zero no matter how many codes were tried, and only the per-IP limit stood
 * between a six-digit code and a machine (CD-AUTH-02). Keyed by the address,
 * every guess lands on the same row and is counted.
 */
function rowFor(normalizedEmail: string) {
  return col().doc(sha256(normalizedEmail));
}

/** Constant-time compare of two hex digests. */
function sameDigest(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Issues a 6-digit code. Any prior code for this user is dropped. */
export async function createEmailVerifyCode(userId: string, email: string): Promise<string> {
  const code = String(randomInt(100000, 1000000));
  const now = Date.now();
  const normalized = normalize(email);
  const ref = rowFor(normalized);

  const prior = await col().where("userId", "==", userId).get();
  const batch = getAdminDb().batch();
  for (const doc of prior.docs) {
    // Rows written before this was keyed by address carry the old id, so they
    // are cleared here too; the row being rewritten is left to the set below.
    if (doc.ref.path !== ref.path) batch.delete(doc.ref);
  }

  const token: EmailVerifyCode = {
    codeHash: sha256(code),
    userId,
    email: normalized,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
    attempts: 0,
  };
  batch.set(ref, token);
  await batch.commit();

  return code;
}

/**
 * Checks the code for an email address. Returns the user id on success, or null
 * when the code is wrong, expired, or too many attempts were made.
 *
 * A wrong guess is counted here rather than in a second call: the count and the
 * check have to be one transaction, or two requests racing each other each read
 * the same attempt number and write it back.
 */
export async function consumeEmailVerifyCode(
  email: string,
  code: string,
): Promise<string | null> {
  const normalized = normalize(email);
  const trimmed = code.trim();
  if (!/^\d{6}$/.test(trimmed)) return null;

  const db = getAdminDb();
  const ref = rowFor(normalized);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return null;

    const token = doc.data() as EmailVerifyCode;
    const now = Date.now();

    if (token.email !== normalized || Date.parse(token.expiresAt) <= now) {
      tx.delete(ref);
      return null;
    }

    if (!sameDigest(token.codeHash, sha256(trimmed))) {
      const attempts = (token.attempts ?? 0) + 1;
      // Five wrong guesses burn the code. A six-digit number falls to a
      // million tries otherwise, and the code lives for fifteen minutes.
      if (attempts >= MAX_ATTEMPTS) tx.delete(ref);
      else tx.update(ref, { attempts });
      return null;
    }

    tx.delete(ref);
    return token.userId;
  });
}
