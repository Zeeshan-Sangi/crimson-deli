import { NextResponse } from "next/server";
import { createEmailVerifyCode } from "@/lib/auth/email-verify";
import { sendEmailVerificationEmail } from "@/lib/auth/mailer";
import { AuthError, createUser } from "@/lib/auth/store";
import { isPhone } from "@/lib/forms/validate";
import { guardForm, type GuardedBody } from "@/lib/security/form-guard";
import { clientIp, consumeShared } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let name = "";
  let email = "";
  let phone = "";
  let password = "";
  let body: GuardedBody;

  try {
    const parsed = (await request.json()) as GuardedBody & {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };
    body = parsed;
    name = parsed.name ?? "";
    email = parsed.email ?? "";
    phone = parsed.phone ?? "";
    password = parsed.password ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const key = `register:${ip}:${email.trim().toLowerCase()}`;
  const limit = await consumeShared(key, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const blocked = await guardForm(body, { ip, minFillMs: 3000 });
  if (blocked) return blocked;

  // Customers must leave a number the counter can call about an order; staff
  // accounts made in the portal go through createUser without one.
  if (!isPhone(phone)) {
    return NextResponse.json({ error: "Please enter a 10-digit phone number." }, { status: 400 });
  }

  try {
    const user = await createUser({
      name,
      email,
      phone,
      password,
      role: "customer",
    });

    const code = await createEmailVerifyCode(user.id, user.email);
    await sendEmailVerificationEmail({ to: user.email, name: user.name, code });

    return NextResponse.json({
      needsVerification: true,
      email: user.email,
      message: "Check your email for a 6-digit verification code.",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[register] failed", err);
    return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  }
}
