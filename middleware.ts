import { NextResponse, type NextRequest } from "next/server";
import { apiAccess } from "@/lib/auth/access";
import { SESSION_COOKIE, readSessionCookie } from "@/lib/auth/session";
import { AREA_ROLES, type Role } from "@/lib/auth/types";

/**
 * Role guards for portals and sensitive APIs.
 *
 * Storefront pages stay public. Portal routes and staff/admin APIs require a
 * signed session with the right role. Route handlers still call requireRole()
 * as defence in depth.
 */

function homeFor(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "staff") return "/team";
  return "/account";
}

function portalRoles(pathname: string): Role[] | null {
  for (const [prefix, roles] of Object.entries(AREA_ROLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return roles;
  }
  return null;
}

function forbiddenApi(): NextResponse {
  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

function unauthorizedApi(): NextResponse {
  return NextResponse.json({ error: "Please sign in." }, { status: 401 });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const apiRule = apiAccess(pathname, method);
  if (apiRule !== null) {
    const user = await readSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);
    if (!user) return unauthorizedApi();
    if (apiRule !== "authenticated" && !apiRule.includes(user.role)) {
      return forbiddenApi();
    }
    return NextResponse.next();
  }

  const allowed = portalRoles(pathname);
  if (!allowed) return NextResponse.next();

  const user = await readSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

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
  matcher: [
    "/account/:path*",
    "/team/:path*",
    "/admin/:path*",
    "/api/staff/:path*",
    "/api/settings",
    "/api/orders",
    "/api/orders/:path*",
    "/api/products",
    "/api/messages",
    "/api/reviews",
    "/api/account",
  ],
};
