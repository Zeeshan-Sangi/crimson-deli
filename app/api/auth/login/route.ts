import { NextResponse } from "next/server";
import { authenticate, needsEmailVerification, sessionUserFrom } from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { guardForm, type GuardedBody } from "@/lib/security/form-guard";
import { clientIp, consumeShared, resetShared } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  let password = "";
  let body: GuardedBody;
  try {
    const parsed = (await request.json()) as GuardedBody & { email?: string; password?: string };
    body = parsed;
    email = parsed.email ?? "";
    password = parsed.password ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Brute-force speed bump: 8 attempts per IP+email per 10 minutes.
  const ip = await clientIp();
  const key = `login:${ip}:${email.trim().toLowerCase()}`;
  const limit = await consumeShared(key, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  // No fill-time check: a password manager can fill and submit in a blink.
  const blocked = await guardForm(body, { ip, minFillMs: 0 });
  if (blocked) return blocked;

  const user = await authenticate(email, password);
  // One message for both wrong-email and wrong-password: never confirm which
  // addresses have accounts.
  if (!user) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  if (needsEmailVerification(user)) {
    return NextResponse.json(
      {
        error: "Verify your email before signing in.",
        needsVerification: true,
        email: user.email,
      },
      { status: 403 },
    );
  }

  await resetShared(key);

  const cookie = await createSessionCookie(sessionUserFrom(user));

  const res = NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, cookie, sessionCookieOptions);
  return res;
}
