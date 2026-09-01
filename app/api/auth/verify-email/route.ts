import { NextResponse } from "next/server";
import {
  consumeEmailVerifyCode,
  createEmailVerifyCode,
  recordEmailVerifyAttempt,
} from "@/lib/auth/email-verify";
import { sendEmailVerificationEmail } from "@/lib/auth/mailer";
import {
  AuthError,
  findByEmail,
  findById,
  markEmailVerified,
  needsEmailVerification,
  sessionUserFrom,
} from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  let code = "";
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    email = body.email ?? "";
    code = body.code ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`verify:${ip}:${email.trim().toLowerCase()}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const userId = await consumeEmailVerifyCode(email, code);
  if (!userId) {
    await recordEmailVerifyAttempt(email, code);
    return NextResponse.json(
      { error: "That code is incorrect or has expired. Request a new one." },
      { status: 400 },
    );
  }

  const user = await findById(userId);
  if (!user || user.disabledAt) {
    return NextResponse.json({ error: "That account is no longer active." }, { status: 400 });
  }

  try {
    const verified = needsEmailVerification(user)
      ? await markEmailVerified(user.id)
      : user;

    const cookie = await createSessionCookie(sessionUserFrom(verified));
    const res = NextResponse.json({
      ok: true,
      user: { name: verified.name, email: verified.email, role: verified.role },
    });
    res.cookies.set(SESSION_COOKIE, cookie, sessionCookieOptions);
    return res;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[verify-email] failed", err);
    return NextResponse.json({ error: "Could not verify your email." }, { status: 500 });
  }
}

/** Resend the signup verification code. */
export async function PUT(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`verify-resend:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const ok = NextResponse.json({
    ok: true,
    message: "If that email needs verification, a new code is on its way.",
  });

  const user = await findByEmail(email);
  if (!user || user.disabledAt || !needsEmailVerification(user)) return ok;

  try {
    const code = await createEmailVerifyCode(user.id, user.email);
    await sendEmailVerificationEmail({ to: user.email, name: user.name, code });
  } catch (err) {
    console.error("[verify-email] resend failed", err);
  }

  return ok;
}
