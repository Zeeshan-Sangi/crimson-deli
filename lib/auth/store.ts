import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword, verifyPassword } from "./password";
import type { Role, User } from "./types";

/**
 * User store — interim implementation.
 *
 * Backed by a JSON file so staff accounts work today without Firebase. Every
 * caller goes through these functions, so moving to Firebase Auth + custom
 * claims later means rewriting this file only.
 *
 * NOTE: like the order store, a JSON file does not survive on serverless
 * hosting. Real deployment needs Firebase Auth (CLAUDE.md §4).
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<User[]> {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as User[]).map((u) => ({
      ...u,
      phone: u.phone ?? null,
      firebaseUid: u.firebaseUid ?? null,
    }));
  } catch {
    return [];
  }
}

async function writeAll(users: User[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export class AuthError extends Error {}

export async function listUsers(): Promise<User[]> {
  const users = await readAll();
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

export async function findByEmail(email: string): Promise<User | null> {
  const users = await readAll();
  const needle = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === needle) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  const users = await readAll();
  return users.find((u) => u.id === id) ?? null;
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

  return serialise(async () => {
    const users = await readAll();
    if (users.some((u) => u.email.toLowerCase() === email))
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
    };
    await writeAll([...users, user]);
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
  return serialise(async () => {
    const users = await readAll();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) throw new AuthError("User not found.");
    users[i] = { ...users[i], role };
    await writeAll(users);
    return users[i];
  });
}

export async function setUserDisabled(id: string, disabled: boolean): Promise<User> {
  return serialise(async () => {
    const users = await readAll();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) throw new AuthError("User not found.");
    const admins = users.filter((u) => u.role === "admin" && !u.disabledAt);
    if (disabled && users[i].role === "admin" && admins.length <= 1)
      throw new AuthError("Cannot disable the last active admin.");
    users[i] = {
      ...users[i],
      disabledAt: disabled ? new Date().toISOString() : null,
    };
    await writeAll(users);
    return users[i];
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

  return serialise(async () => {
    const users = await readAll();
    let idx = users.findIndex((u) => u.firebaseUid === firebaseUid);
    if (idx === -1 && phone) idx = users.findIndex((u) => u.phone === phone);
    if (idx === -1 && emailRaw)
      idx = users.findIndex((u) => u.email.toLowerCase() === emailRaw);

    if (idx !== -1) {
      const existing = users[idx];
      users[idx] = {
        ...existing,
        firebaseUid,
        phone: phone ?? existing.phone,
        email: emailRaw || existing.email,
        name: name || existing.name,
      };
      await writeAll(users);
      return users[idx];
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
    };
    await writeAll([...users, user]);
    return user;
  });
}

export async function setUserPassword(id: string, password: string): Promise<void> {
  if (password.length < 8)
    throw new AuthError("Password must be at least 8 characters.");
  const passwordHash = await hashPassword(password);
  await serialise(async () => {
    const users = await readAll();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) throw new AuthError("User not found.");
    users[i] = { ...users[i], passwordHash };
    await writeAll(users);
  });
}
