import { NextResponse } from "next/server";
import { findByEmail } from "@/lib/auth/store";
import { createResetToken } from "@/lib/auth/reset-tokens";
import { sendPasswordResetEmail } from "@/lib/auth/mailer";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/** Absolute base for the link in the email. */
function origin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`forgot:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  // Always the same answer, whether or not the address has an account. Telling
  // the caller which emails are registered would turn this into a user-
  // enumeration oracle — the same reason /api/auth/login has one error message.
  const ok = NextResponse.json({
    ok: true,
    message: "If that email has an account, a reset link is on its way.",
  });

  const user = await findByEmail(email);
  if (!user || user.disabledAt) return ok;

  try {
    const token = await createResetToken(user.id);
    const resetUrl = `${origin(request)}/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  } catch (err) {
    // Log for the operator, but keep the response identical — an error here
    // would otherwise reveal that the address exists.
    console.error("[forgot-password] could not send reset email", err);
  }

  return ok;
}
