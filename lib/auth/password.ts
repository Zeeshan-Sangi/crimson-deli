import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;

/** Hashes a password as `salt:hash`. scrypt is deliberately slow. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEYLEN);
  return `${salt}:${derived.toString("hex")}`;
}

/** Constant-time check so a wrong password cannot be found by timing. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await scryptAsync(password, salt, KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}
