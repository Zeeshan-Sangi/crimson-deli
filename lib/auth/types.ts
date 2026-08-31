/** Roles from CLAUDE.md §4. Guests are simply unauthenticated. */
export const ROLES = ["customer", "staff", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  firebaseUid: string | null;
  role: Role;
  /** scrypt hash — never the password itself. */
  passwordHash: string;
  createdAt: string;
  disabledAt: string | null;
};

/** What travels in the session cookie. Deliberately small. */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

/** Which roles may enter each portal area. */
export const AREA_ROLES: Record<string, Role[]> = {
  "/admin": ["admin"],
  "/team": ["staff", "admin"],
  "/account": ["customer", "staff", "admin"],
};
