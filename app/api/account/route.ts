import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AuthError, authenticate, setUserPassword } from "@/lib/auth/store";

export const dynamic = "force-dynamic";

/** Change your own password. Requires the current one, whatever your role. */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  try {
    const body = (await request.json()) as { current?: string; next?: string };
    if (!body.current || !body.next) {
      return NextResponse.json({ error: "Both passwords are required." }, { status: 400 });
    }

    // Re-check the current password so a borrowed session cannot take the account.
    const ok = await authenticate(user.email, body.current);
    if (!ok) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    await setUserPassword(user.id, body.next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[account] password change failed", err);
    return NextResponse.json({ error: "Could not change the password." }, { status: 500 });
  }
}
