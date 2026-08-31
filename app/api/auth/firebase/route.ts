import { NextResponse } from "next/server";
import { upsertFirebaseUser } from "@/lib/auth/store";
import { SESSION_COOKIE, createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { getAdminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminAuth = getAdminAuth();
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

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const user = await upsertFirebaseUser({
      firebaseUid: decoded.uid,
      email: decoded.email,
      phone: decoded.phone_number,
      name: decoded.name,
    });

    if (user.disabledAt) {
      return NextResponse.json({ error: "This account is disabled." }, { status: 403 });
    }

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
    console.error("[firebase auth] failed", err);
    return NextResponse.json({ error: "Could not verify your sign-in." }, { status: 401 });
  }
}
