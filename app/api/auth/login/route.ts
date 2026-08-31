import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { clientIp, consume, reset } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = body.email ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Brute-force speed bump: 8 attempts per IP+email per 10 minutes.
  const ip = await clientIp();
  const key = `login:${ip}:${email.trim().toLowerCase()}`;
  const limit = consume(key, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const user = await authenticate(email, password);
  // One message for both wrong-email and wrong-password: never confirm which
  // addresses have accounts.
  if (!user) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  reset(key);

  const cookie = await createSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, cookie, sessionCookieOptions);
  return res;
}
