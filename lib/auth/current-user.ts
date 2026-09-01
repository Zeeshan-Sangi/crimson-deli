import { cookies } from "next/headers";
import { findById } from "./store";
import { SESSION_COOKIE, readSessionCookie } from "./session";
import type { Role, SessionUser } from "./types";

/** The signed-in user for the current request, or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const user = await findById(session.id);
  if (!user || user.disabledAt) return null;
  if ((user.sessionVersion ?? 0) !== session.sv) return null;

  return session;
}

/** Throws unless the current user holds one of `allowed`. Guards route handlers. */
export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || !allowed.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}
