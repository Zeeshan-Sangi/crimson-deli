import { AREA_ROLES, type Role } from "./types";

/** Roles allowed into a portal path, or null when the path is not a guarded area. */
export function rolesForPortalPath(pathname: string): Role[] | null {
  for (const [prefix, roles] of Object.entries(AREA_ROLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return roles;
  }
  return null;
}

/**
 * Middleware gate for sensitive API routes.
 * `null` = public (no session required). `"authenticated"` = any signed-in user.
 */
export type ApiAccess = Role[] | "authenticated" | null;

export function apiAccess(pathname: string, method: string): ApiAccess {
  if (pathname.startsWith("/api/staff")) return ["admin"];

  if (pathname === "/api/settings") {
    if (method === "GET") return ["staff", "admin"];
    if (method === "PUT") return ["admin"];
    return ["admin"];
  }

  if (pathname === "/api/orders") {
    if (method === "GET") return ["staff", "admin"];
    if (method === "POST") return "authenticated";
    return null;
  }

  if (pathname.startsWith("/api/orders/") && method === "PATCH") {
    return ["staff", "admin"];
  }

  if (pathname === "/api/products") {
    if (method === "GET" || method === "PATCH") return ["staff", "admin"];
    if (method === "POST" || method === "DELETE") return ["admin"];
    return ["admin"];
  }

  if (pathname === "/api/messages") {
    if (method === "POST") return null;
    return ["staff", "admin"];
  }

  if (pathname === "/api/reviews" && method === "DELETE") {
    return ["staff", "admin"];
  }

  if (pathname === "/api/account") return "authenticated";

  return null;
}

/** Safe post-login redirect — never send a user to a portal they cannot enter. */
export function homeForRole(role: Role, next: string): string {
  const trimmed = next.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    const allowed = rolesForPortalPath(trimmed);
    if (!allowed || allowed.includes(role)) return trimmed;
  }
  if (role === "admin") return "/admin";
  if (role === "staff") return "/team";
  return "/account";
}
