import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/lib/auth/store";

export const dynamic = "force-dynamic";

/**
 * First-run setup: creates the initial admin and staff accounts.
 *
 * Only works while the user store is empty, so it cannot be used to add
 * accounts once the store is live. After this, accounts are managed from
 * /admin/staff.
 */
const SEEDS = [
  {
    email: "admin@crimsondeli.com",
    name: "Store Admin",
    role: "admin" as const,
    password: "crimson-admin-2026",
  },
  {
    email: "staff@crimsondeli.com",
    name: "Counter Staff",
    role: "staff" as const,
    password: "crimson-staff-2026",
  },
];

export async function POST() {
  const existing = await listUsers();
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Accounts already exist. Manage them from /admin/staff." },
      { status: 409 },
    );
  }

  const created = [];
  for (const seed of SEEDS) {
    const user = await createUser(seed);
    created.push({ email: user.email, role: user.role, password: seed.password });
  }

  return NextResponse.json({ created }, { status: 201 });
}
