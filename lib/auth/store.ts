import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import { hashPassword, verifyPassword } from "./password";
import type { Role, User } from "./types";

/**
 * User store — Firestore, one document per user keyed by `id`.
 *
 * Email uniqueness is enforced inside a transaction rather than by a read
 * followed by a write, so two simultaneous signups cannot both pass the check.
 */
const COLLECTION = "users";

function col() {
  return getAdminDb().collection(COLLECTION);
}

/** The seed script left a `_placeholder` doc behind; it is not a user. */
function toUser(doc: FirebaseFirestore.QueryDocumentSnapshot): User | null {
  const data = doc.data();
  if (data._seed === true) return null;
  return {
    ...(data as User),
    phone: (data as User).phone ?? null,
    firebaseUid: (data as User).firebaseUid ?? null,
    sessionVersion: (data as User).sessionVersion ?? 0,
  };
}

/** Email/password accounts must verify; Firebase and legacy users are exempt. */
export function needsEmailVerification(user: User): boolean {
  return user.emailVerifiedAt === null && !user.firebaseUid;
}

export function sessionUserFrom(user: User): {
  id: string;
  email: string;
  name: string;
  role: Role;
  sv: number;
} {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    sv: user.sessionVersion ?? 0,
  };
}

/** Single-field lookup used by the Firebase sign-in reconciliation. */
async function findOneBy(field: string, value: string): Promise<User | null> {
  const snap = await col().where(field, "==", value).limit(1).get();
  return snap.empty ? null : toUser(snap.docs[0]);
}

async function allUsers(): Promise<User[]> {
  const snap = await col().get();
  return snap.docs.map(toUser).filter((u): u is User => u !== null);
}

export class AuthError extends Error {}

export async function listUsers(): Promise<User[]> {
  const users = await allUsers();
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

export async function findByEmail(email: string): Promise<User | null> {
  const needle = email.trim().toLowerCase();
  const snap = await col().where("email", "==", needle).limit(1).get();
  return snap.empty ? null : toUser(snap.docs[0]);
}

export async function findById(id: string): Promise<User | null> {
  const doc = await col().doc(id).get();
  if (!doc.exists) return null;
  return toUser(doc as FirebaseFirestore.QueryDocumentSnapshot);
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export async function createUser(input: {
  email: string;
  name: string;
  role: Role;
  password: string;
  phone?: string | null;
  /** Staff/admin accounts skip the email OTP step. */
  trustedEmail?: boolean;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phoneRaw = input.phone?.trim() ?? "";
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new AuthError("That email address is not valid.");
  if (!name) throw new AuthError("A name is required.");
  if (input.password.length < 8)
    throw new AuthError("Password must be at least 8 characters.");
  if (phone && phone.length < 10)
    throw new AuthError("Enter a valid phone number.");

  const passwordHash = await hashPassword(input.password);

  const db = getAdminDb();
  return db.runTransaction(async (tx) => {
    const clash = await tx.get(col().where("email", "==", email).limit(1));
    if (!clash.empty)
      throw new AuthError("An account with that email already exists.");

    const user: User = {
      id: randomUUID(),
      email,
      name,
      phone,
      firebaseUid: null,
      role: input.role,
      passwordHash,
      createdAt: new Date().toISOString(),
      disabledAt: null,
      emailVerifiedAt: input.trustedEmail ? new Date().toISOString() : null,
      sessionVersion: 0,
    };
    tx.set(col().doc(user.id), user);
    return user;
  });
}

/** Returns the user on a correct password, or null. Never says which half failed. */
export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findByEmail(email);
  if (!user || user.disabledAt) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}

export async function setUserRole(id: string, role: Role): Promise<User> {
  const db = getAdminDb();
  // Transactional for the same reason as setUserDisabled: the last-admin check
  // is a read-then-write, and two admins demoting each other at once must not
  // both pass it.
  return db.runTransaction(async (tx) => {
    const ref = col().doc(id);
    const doc = await tx.get(ref);
    if (!doc.exists) throw new AuthError("User not found.");
    const current = doc.data() as User;

    // Demoting the only admin who can still sign in locks everyone out of
    // /admin and /api/staff for good — there is no public bootstrap route to
    // recover through. An already-disabled admin is not holding the door open,
    // so demoting one of those stays allowed.
    if (current.role === "admin" && role !== "admin" && !current.disabledAt) {
      const admins = await tx.get(col().where("role", "==", "admin"));
      const active = admins.docs.filter((d) => !(d.data() as User).disabledAt);
      if (active.length <= 1)
        throw new AuthError("Cannot change the role of the last active admin.");
    }

    const changed = current.role !== role;
    const updated: User = {
      ...current,
      role,
      // getCurrentUser reads the role out of the session cookie, so without a
      // bump here a demoted admin keeps every admin route until that cookie
      // expires. Only on a real change, or saving the same role would sign the
      // user out of their other devices for nothing.
      sessionVersion: (current.sessionVersion ?? 0) + (changed ? 1 : 0),
    };
    tx.set(ref, updated);
    return updated;
  });
}

export async function setUserDisabled(id: string, disabled: boolean): Promise<User> {
  const db = getAdminDb();
  // Transactional: the "last active admin" check is a read-then-write, and two
  // admins disabling each other at once must not both succeed.
  return db.runTransaction(async (tx) => {
    const ref = col().doc(id);
    const doc = await tx.get(ref);
    if (!doc.exists) throw new AuthError("User not found.");
    const current = doc.data() as User;

    if (disabled && current.role === "admin") {
      const admins = await tx.get(col().where("role", "==", "admin"));
      const active = admins.docs.filter((d) => !(d.data() as User).disabledAt);
      if (active.length <= 1)
        throw new AuthError("Cannot disable the last active admin.");
    }

    const updated: User = {
      ...current,
      disabledAt: disabled ? new Date().toISOString() : null,
    };
    tx.set(ref, updated);
    return updated;
  });
}

/**
 * Signs a customer in from a verified Firebase token, creating the account the
 * first time.
 *
 * Two rules decide who this may return, and both exist because anyone can put
 * any address on a Firebase account:
 *
 * 1. An email address only identifies an account when Firebase says it is
 *    verified. Otherwise it is a claim, not proof, and claiming
 *    `owner@crimsondeli.com` would have handed over that account.
 * 2. Staff and admin never sign in this way at all. They have passwords, and
 *    the blast radius of getting rule 1 wrong for them is the whole store.
 *
 * Matching by phone number is gone with phone sign-in: a recycled number would
 * have been a second way into somebody else's account.
 */
export async function upsertFirebaseUser(input: {
  firebaseUid: string;
  email?: string | null;
  /** Firebase's own `email_verified` claim — never inferred here. */
  emailVerified: boolean;
  name?: string | null;
}): Promise<User> {
  const firebaseUid = input.firebaseUid.trim();
  if (!firebaseUid) throw new AuthError("Missing Firebase account.");

  const emailRaw = input.email?.trim().toLowerCase() ?? "";
  const emailVerified = input.emailVerified === true && emailRaw !== "";
  const name = input.name?.trim() ?? "";

  // The uid is the only identifier proved by the token itself; the email is
  // usable once Firebase has verified it.
  const existing =
    (await findOneBy("firebaseUid", firebaseUid)) ??
    (emailVerified ? await findOneBy("email", emailRaw) : null);

  if (existing && existing.role !== "customer")
    throw new AuthError("Staff accounts sign in with their email and password.");

  if (existing) {
    const updated: User = {
      ...existing,
      firebaseUid,
      // An unverified address never overwrites the one already on the account.
      email: emailVerified ? emailRaw : existing.email,
      name: name || existing.name,
      emailVerifiedAt: emailVerified
        ? existing.emailVerifiedAt ?? new Date().toISOString()
        : existing.emailVerifiedAt,
    };
    await col().doc(existing.id).set(updated);
    return updated;
  }

  // A brand new account has nothing but the token to go on, so it is only
  // opened for an address the provider has actually verified.
  if (!emailVerified)
    throw new AuthError(
      "Verify your email address with your sign-in provider, then try again.",
    );

  const passwordHash = await hashPassword(randomUUID());
  const user: User = {
    id: randomUUID(),
    email: emailRaw,
    name: name || "Customer",
    phone: null,
    firebaseUid,
    role: "customer",
    passwordHash,
    createdAt: new Date().toISOString(),
    disabledAt: null,
    emailVerifiedAt: new Date().toISOString(),
    sessionVersion: 0,
  };
  await col().doc(user.id).set(user);
  return user;
}

export async function setUserPassword(id: string, password: string): Promise<void> {
  if (password.length < 8)
    throw new AuthError("Password must be at least 8 characters.");
  const passwordHash = await hashPassword(password);
  const ref = col().doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new AuthError("User not found.");
  const current = doc.data() as User;
  await ref.update({
    passwordHash,
    sessionVersion: (current.sessionVersion ?? 0) + 1,
  });
}

export async function markEmailVerified(id: string): Promise<User> {
  const ref = col().doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new AuthError("User not found.");
  const current = doc.data() as User;
  const updated: User = {
    ...current,
    emailVerifiedAt: new Date().toISOString(),
  };
  await ref.set(updated);
  return updated;
}
