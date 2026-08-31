import type { Role, SessionUser } from "./types";

/**
 * Signed-cookie sessions.
 *
 * Uses Web Crypto (not node:crypto) so the same verify runs in middleware and
 * in route handlers. The cookie holds the user's id, name and role signed with
 * an HMAC — it is tamper-evident, not encrypted, so nothing secret goes in it.
 */
export const SESSION_COOKIE = "crimson_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // a working day

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set (32+ random chars) in production.");
  }
  // Dev only: keeps local sessions working without setup. Never used in prod.
  return "crimson-deli-dev-secret-do-not-use-in-production";
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
  // Build on a fresh ArrayBuffer so the result satisfies BufferSource.
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

type Payload = SessionUser & { exp: number };

export async function createSessionCookie(user: SessionUser): Promise<string> {
  const payload: Payload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

/** Returns the session user, or null when missing, tampered with, or expired. */
export async function readSessionCookie(
  value: string | undefined,
): Promise<SessionUser | null> {
  if (!value) return null;
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;

  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await key(),
      unb64url(sig),
      enc.encode(body),
    );
    if (!ok) return null;

    const payload = JSON.parse(new TextDecoder().decode(unb64url(body))) as Payload;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

export function roleAllows(role: Role, allowed: Role[]): boolean {
  return allowed.includes(role);
}
