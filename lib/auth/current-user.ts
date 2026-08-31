import { cookies } from "next/headers";
import { SESSION_COOKIE, readSessionCookie } from "./session";
import type { Role, SessionUser } from "./types";

/** The signed-in user for the current request, or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return readSessionCookie(jar.get(SESSION_COOKIE)?.value);
}

/** Throws unless the current user holds one of `allowed`. Guards route handlers. */
export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || !allowed.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}
