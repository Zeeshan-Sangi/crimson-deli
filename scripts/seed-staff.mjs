/**
 * Creates the first admin account locally — never exposed as a public HTTP route.
 *
 * Usage (dev machine only, with .env.local present):
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='your-strong-password' npm run seed:admin
 *
 * Skips if any user already exists. Staff accounts are added from /admin/staff.
 */
import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEYLEN);
  return `${salt}:${derived.toString("hex")}`;
}

function initDb() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON in .env.local first.");
    process.exit(1);
  }
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(JSON.parse(raw)) });
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
const password = process.env.ADMIN_PASSWORD ?? "";
const name = process.env.ADMIN_NAME?.trim() || "Store Admin";

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Set ADMIN_EMAIL to a valid email.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Set ADMIN_PASSWORD to at least 12 characters.");
  process.exit(1);
}

const db = initDb();
const users = db.collection("users");

const existing = await users.limit(1).get();
if (!existing.empty) {
  console.log("Users already exist. Add staff from /admin/staff when signed in.");
  process.exit(0);
}

const passwordHash = await hashPassword(password);
const user = {
  id: randomUUID(),
  email,
  name,
  phone: null,
  firebaseUid: null,
  role: "admin",
  passwordHash,
  createdAt: new Date().toISOString(),
  disabledAt: null,
  emailVerifiedAt: new Date().toISOString(),
  sessionVersion: 0,
};

await users.doc(user.id).set(user);
console.log(`Created admin  ${email}`);
console.log("Sign in at /login — manage more accounts from /admin/staff.");
