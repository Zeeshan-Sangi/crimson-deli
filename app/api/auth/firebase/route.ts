import { NextResponse } from "next/server";
import { AuthError, upsertFirebaseUser, sessionUserFrom } from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { getAdminAuth } from "@/lib/firebase/admin";
import { clientIp, consumeShared } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Verifying a token is cheap for the caller and not for us, and a failed
  // attempt tells an attacker whether an address exists — the same speed bump
  // the password login gets.
  const ip = await clientIp();
  const limit = await consumeShared(`firebase-auth:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const adminAuth = await getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json(
      { error: "Firebase server credentials are not configured." },
      { status: 503 },
    );
  }

  let idToken = "";
  try {
    const body = (await request.json()) as { idToken?: string };
    idToken = body.idToken ?? "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "Missing sign-in token." }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch (err) {
    console.error("[firebase auth] token rejected", err);
    return NextResponse.json({ error: "Could not verify your sign-in." }, { status: 401 });
  }

  try {
    const user = await upsertFirebaseUser({
      firebaseUid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified === true,
      name: decoded.name,
    });

    if (user.disabledAt) {
      return NextResponse.json({ error: "This account is disabled." }, { status: 403 });
    }

    const cookie = await createSessionCookie(sessionUserFrom(user));

    const res = NextResponse.json({
      user: { name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, cookie, sessionCookieOptions);
    return res;
  } catch (err) {
    // A refused link is the caller's answer, not a server fault: it says the
    // address is unverified, or that the account signs in with a password.
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    console.error("[firebase auth] failed", err);
    return NextResponse.json({ error: "Could not sign you in." }, { status: 500 });
  }
}
