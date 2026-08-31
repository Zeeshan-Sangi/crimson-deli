import { NextResponse } from "next/server";
import { AuthError, findById, setUserPassword } from "@/lib/auth/store";
import { consumeResetToken } from "@/lib/auth/reset-tokens";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let token = "";
  let password = "";
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    token = body.token ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  // Spends the token first: a valid token must not survive a failed write
  // below, and a wrong token must not reach the user store at all.
  const userId = await consumeResetToken(token);
  if (!userId) {
    return NextResponse.json(
      { error: "That reset link has expired or already been used." },
      { status: 400 },
    );
  }

  const user = await findById(userId);
  if (!user || user.disabledAt) {
    return NextResponse.json(
      { error: "That account is no longer active." },
      { status: 400 },
    );
  }

  try {
    await setUserPassword(userId, password);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[reset-password] failed", err);
    return NextResponse.json(
      { error: "Could not update your password." },
      { status: 500 },
    );
  }

  // Deliberately no session here: the new password gets used once at /login,
  // which proves the person holding the link also knows what they just set.
  return NextResponse.json({ ok: true });
}
