import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createUser, listUsers } from "@/lib/auth/store";

export const dynamic = "force-dynamic";

/**
 * First-run setup: creates the initial admin and staff accounts.
 *
 * Passwords come from the environment, never from source. The previous version
 * hard-coded them, which meant anyone reading the public repository knew the
 * admin password — and it echoed them back in the response as well.
 *
 * Three things gate this route:
 *   1. BOOTSTRAP_TOKEN must be set, or the route is disabled outright.
 *   2. The caller must present that token.
 *   3. The user store must still be empty.
 */
type Seed = {
  email: string;
  name: string;
  role: "admin" | "staff";
  passwordEnv: string;
};

const SEEDS: Seed[] = [
  {
    email: "admin@crimsondeli.com",
    name: "Store Admin",
    role: "admin",
    passwordEnv: "BOOTSTRAP_ADMIN_PASSWORD",
  },
  {
    email: "staff@crimsondeli.com",
    name: "Counter Staff",
    role: "staff",
    passwordEnv: "BOOTSTRAP_STAFF_PASSWORD",
  },
];

/** Constant-time compare so the token cannot be guessed by timing. */
function tokenMatches(supplied: string, expected: string): boolean {
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.BOOTSTRAP_TOKEN;
  if (!expected) {
    // Absent token means the route is off. Safer default than a route that
    // works for whoever finds it first.
    return NextResponse.json(
      { error: "Setup is disabled. Set BOOTSTRAP_TOKEN to enable it." },
      { status: 404 },
    );
  }

  let supplied = "";
  try {
    const body = (await request.json()) as { token?: string };
    supplied = body.token ?? "";
  } catch {
    supplied = "";
  }
  if (!supplied || !tokenMatches(supplied, expected)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const existing = await listUsers();
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Accounts already exist. Manage them from /admin/staff." },
      { status: 409 },
    );
  }

  const missing = SEEDS.filter((s) => {
    const pw = process.env[s.passwordEnv];
    return !pw || pw.length < 12;
  }).map((s) => s.passwordEnv);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Set ${missing.join(" and ")} to a strong value (12+ characters) before running setup.`,
      },
      { status: 400 },
    );
  }

  const created = [];
  for (const seed of SEEDS) {
    const user = await createUser({
      email: seed.email,
      name: seed.name,
      role: seed.role,
      password: process.env[seed.passwordEnv]!,
      trustedEmail: true,
    });
    // Deliberately no password in the response — whoever set the env var
    // already knows it, and anyone else must not learn it from here.
    created.push({ email: user.email, role: user.role });
  }

  return NextResponse.json({ created }, { status: 201 });
}
