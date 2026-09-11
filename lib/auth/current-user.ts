import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findById } from "./store";
import { homeForRole } from "./access";
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

/**
 * The user for a portal page, or a redirect away from it.
 *
 * Middleware decides the same thing a step earlier, but it only has the signed
 * cookie to go on: it cannot reach Firestore from the edge, so it is working
 * from claims that were true when the cookie was issued — up to twelve hours
 * ago (CD-MW-01). This runs per request against the stored user, so a disabled
 * account or one whose role has changed stops rendering the page immediately,
 * and a page's role gate never rests on middleware alone.
 */
export async function requirePageRole(allowed: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!allowed.includes(user.role)) redirect(homeForRole(user.role, ""));
  return user;
}

/** Throws unless the current user holds one of `allowed`. Guards route handlers. */
export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || !allowed.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}
