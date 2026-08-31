import { NextResponse } from "next/server";
import { AuthError, createUser } from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let name = "";
  let email = "";
  let phone = "";
  let password = "";

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };
    name = body.name ?? "";
    email = body.email ?? "";
    phone = body.phone ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const key = `register:${ip}:${email.trim().toLowerCase()}`;
  const limit = consume(key, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  try {
    const user = await createUser({
      name,
      email,
      phone,
      password,
      role: "customer",
    });

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
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[register] failed", err);
    return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  }
}
