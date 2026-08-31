import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
const DATA_DIR = path.join(process.cwd(), ".data");
const TOKENS_FILE = path.join(DATA_DIR, "reset-tokens.json");

const TTL_MS = 60 * 60 * 1000; // one hour
const MAX_TOKENS = 500;

type ResetToken = {
  /** SHA-256 of the raw token, hex. Never the token itself. */
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<ResetToken[]> {
  try {
    const raw = await readFile(TOKENS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ResetToken[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(tokens: ResetToken[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Drops used and expired rows so the file cannot grow without bound. */
function prune(tokens: ResetToken[], now: number): ResetToken[] {
  return tokens
    .filter((t) => !t.usedAt && Date.parse(t.expiresAt) > now)
    .slice(-MAX_TOKENS);
}

/**
 * Issues a token for a user and returns the raw value — the only time it
 * exists in plaintext. Any earlier token for the same user is dropped, so a
 * second "forgot password" click invalidates the first email.
 */
export async function createResetToken(userId: string): Promise<string> {
  const raw = randomBytes(32).toString("base64url");
  const now = Date.now();

  await serialise(async () => {
    const tokens = prune(await readAll(), now).filter((t) => t.userId !== userId);
    tokens.push({
      tokenHash: hashToken(raw),
      userId,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + TTL_MS).toISOString(),
      usedAt: null,
    });
    await writeAll(tokens);
  });

  return raw;
}

/** True when the token is live — used to decide whether to show the form. */
export async function peekResetToken(raw: string): Promise<boolean> {
  if (!raw) return false;
  const wanted = hashToken(raw);
  const now = Date.now();
  return (await readAll()).some(
    (t) => t.tokenHash === wanted && !t.usedAt && Date.parse(t.expiresAt) > now,
  );
}

/**
 * Spends a token and returns the user it belongs to, or null when it is
 * unknown, already used, or expired. Marking happens in the same serialised
 * write as the lookup, so a token cannot be redeemed twice concurrently.
 */
export async function consumeResetToken(raw: string): Promise<string | null> {
  if (!raw) return null;
  const wanted = Buffer.from(hashToken(raw), "hex");
  const now = Date.now();

  return serialise(async () => {
    const tokens = await readAll();
    const i = tokens.findIndex((t) => {
      const candidate = Buffer.from(t.tokenHash, "hex");
      return (
        candidate.length === wanted.length && timingSafeEqual(candidate, wanted)
      );
    });
    if (i === -1) return null;

    const token = tokens[i];
    if (token.usedAt || Date.parse(token.expiresAt) <= now) return null;

    tokens[i] = { ...token, usedAt: new Date(now).toISOString() };
    await writeAll(prune(tokens, now));
    return token.userId;
  });
}
