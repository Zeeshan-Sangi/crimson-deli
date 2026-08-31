/**
 * Creates the first admin and staff accounts by calling the bootstrap route,
 * so the hashing and storage logic lives in one place (lib/auth/store.ts).
 *
 * Usage: npm run seed:staff   (the dev server must be running)
 */
const base = process.env.SITE_URL ?? "http://localhost:3000";

const res = await fetch(`${base}/api/auth/bootstrap`, { method: "POST" });
const data = await res.json().catch(() => ({}));

if (res.status === 409) {
  console.log("Accounts already exist. Manage them from /admin/staff.");
  process.exit(0);
}
if (!res.ok) {
  console.error("Bootstrap failed:", data.error ?? res.status);
  process.exit(1);
}

for (const u of data.created) {
  console.log(`  created  ${u.email}  (${u.role})  password: ${u.password}`);
}
console.log("\nChange these passwords from /admin/staff before the site goes public.");
