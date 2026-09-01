import { createHash, randomInt } from "node:crypto";
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

function hashCode(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function isLive(t: EmailVerifyCode, now: number): boolean {
  return t.attempts < MAX_ATTEMPTS && Date.parse(t.expiresAt) > now;
}

/** Issues a 6-digit code. Any prior code for this user is dropped. */
export async function createEmailVerifyCode(userId: string, email: string): Promise<string> {
  const code = String(randomInt(100000, 1000000));
  const now = Date.now();
  const normalized = email.trim().toLowerCase();

  const prior = await col().where("userId", "==", userId).get();
  const batch = getAdminDb().batch();
  for (const doc of prior.docs) batch.delete(doc.ref);

  const token: EmailVerifyCode = {
    codeHash: hashCode(code),
    userId,
    email: normalized,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
    attempts: 0,
  };
  batch.set(col().doc(token.codeHash), token);
  await batch.commit();

  return code;
}

/**
 * Checks the code for an email address. Returns the user id on success, or null
 * when the code is wrong, expired, or too many attempts were made.
 */
export async function consumeEmailVerifyCode(
  email: string,
  code: string,
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const trimmed = code.trim();
  if (!/^\d{6}$/.test(trimmed)) return null;

  const db = getAdminDb();
  const ref = col().doc(hashCode(trimmed));

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return null;

    const token = doc.data() as EmailVerifyCode;
    const now = Date.now();
    if (token.email !== normalized) return null;
    if (!isLive(token, now)) {
      tx.delete(ref);
      return null;
    }

    tx.delete(ref);
    return token.userId;
  });
}

/** Records a failed attempt without revealing whether the code existed. */
export async function recordEmailVerifyAttempt(email: string, code: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const trimmed = code.trim();
  if (!/^\d{6}$/.test(trimmed)) return;

  const db = getAdminDb();
  const ref = col().doc(hashCode(trimmed));

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return;
    const token = doc.data() as EmailVerifyCode;
    if (token.email !== normalized) return;
    if (!isLive(token, Date.now())) {
      tx.delete(ref);
      return;
    }
    const attempts = token.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      tx.delete(ref);
      return;
    }
    tx.update(ref, { attempts });
  });
}
