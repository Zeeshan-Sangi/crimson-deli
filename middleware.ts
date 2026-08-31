import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readSessionCookie } from "@/lib/auth/session";
import { AREA_ROLES, type Role } from "@/lib/auth/types";

/**
 * Role guards for the portals.
 *
 * The storefront is entirely public and is not matched here. Everything under
 * /account, /team and /admin requires a signed session with the right role
 * (CLAUDE.md §4). The cookie is signed, so a tampered role fails verification
 * and is treated as signed-out.
 *
 * This is defence in depth, not the only check: route handlers that read or
 * write data call requireRole() as well, because middleware alone cannot
 * protect against a request that never passes through it.
 */

/** Where each role lands when it has no business in the area it asked for. */
function homeFor(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "staff") return "/team";
  return "/account";
}

function areaFor(pathname: string): Role[] | null {
  for (const [prefix, roles] of Object.entries(AREA_ROLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return roles;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allowed = areaFor(pathname);
  if (!allowed) return NextResponse.next();

  const user = await readSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Staff may read contact messages; everything else under /admin stays admin-only.
  if (
    pathname === "/admin/messages" &&
    (user.role === "staff" || user.role === "admin")
  ) {
    return NextResponse.next();
  }

  if (!allowed.includes(user.role)) {
    const url = request.nextUrl.clone();
    url.pathname = homeFor(user.role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/team/:path*", "/admin/:path*"],
};
