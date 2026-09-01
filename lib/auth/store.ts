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
  const doc = await col().doc(id).get();
  if (!doc.exists) throw new AuthError("User not found.");
  const updated = { ...(doc.data() as User), role };
  await col().doc(id).set(updated);
  return updated;
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

export async function upsertFirebaseUser(input: {
  firebaseUid: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
}): Promise<User> {
  const firebaseUid = input.firebaseUid.trim();
  if (!firebaseUid) throw new AuthError("Missing Firebase account.");

  const emailRaw = input.email?.trim().toLowerCase() ?? "";
  const phoneRaw = input.phone?.trim() ?? "";
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  const name = input.name?.trim() ?? "";

  // Matched on firebaseUid first, then phone, then email — a customer who
  // signed up by email and later uses Google should land on the same account.
  const existing =
    (await findOneBy("firebaseUid", firebaseUid)) ??
    (phone ? await findOneBy("phone", phone) : null) ??
    (emailRaw ? await findOneBy("email", emailRaw) : null);

  if (existing) {
    const updated: User = {
      ...existing,
      firebaseUid,
      phone: phone ?? existing.phone,
      email: emailRaw || existing.email,
      name: name || existing.name,
      emailVerifiedAt: existing.emailVerifiedAt ?? new Date().toISOString(),
    };
    await col().doc(existing.id).set(updated);
    return updated;
  }

  const email =
    emailRaw ||
    (phone ? `phone+${phone}@phone.crimsondeli.com` : `uid+${firebaseUid}@firebase.crimsondeli.com`);
  const passwordHash = await hashPassword(randomUUID());
  const user: User = {
    id: randomUUID(),
    email,
    name: name || (phone ? `Customer ${phone.slice(-4)}` : "Customer"),
    phone,
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
