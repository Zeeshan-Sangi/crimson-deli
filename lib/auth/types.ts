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
  /** When set, email/password sign-in requires verification. Null = pending. */
  emailVerifiedAt?: string | null;
  /** Bumped on password change so old session cookies stop working. */
  sessionVersion?: number;
};

/** What travels in the session cookie. Deliberately small. */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Must match the user's sessionVersion in the store. */
  sv: number;
};

/** Which roles may enter each portal area. */
export const AREA_ROLES: Record<string, Role[]> = {
  "/admin": ["admin"],
  "/team": ["staff", "admin"],
  "/account": ["customer", "staff", "admin"],
};
