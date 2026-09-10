/**
 * Rewrites the water ice and gelati descriptions in Firestore.
 *
 * Products live in Firestore and admin edits win over `lib/data/food-menu.ts`,
 * so a store that has already been seeded keeps the old copy — the one telling
 * customers to "ask at the counter for the flavor you want", which now sits
 * directly under a flavor picker that does exactly that.
 *
 * Usage (dev machine, with .env.local present):
 *   node --env-file=.env.local scripts/sync-flavor-descriptions.mjs
 *
 * Only rewrites a description that still asks the customer to pick at the
 * counter, so re-running it — or running it after the store has written its own
 * copy from /admin/products — changes nothing.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const UPDATES = {
  "water-ice":
    "Philadelphia water ice (Italian ice). Pick your flavor above — this week's special is sour apple.",
  gelati:
    "Layers of creamy soft-serve ice cream with your favorite water ice. Pick the ice cream base and the water ice flavor above — this week's water ice special is sour apple.",
};

/** The wording this script exists to replace. */
const STALE = /ask at the counter|flavors:|vanilla or chocolate ice cream base/i;

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

const db = initDb();
const products = db.collection("products");
const now = new Date().toISOString();

for (const [slug, description] of Object.entries(UPDATES)) {
  const ref = products.doc(slug);
  const snap = await ref.get();

  if (!snap.exists) {
    console.log(`skip  ${slug} — no such product`);
    continue;
  }

  const current = snap.data()?.description ?? "";
  if (current === description) {
    console.log(`ok    ${slug} — already up to date`);
    continue;
  }
  if (!STALE.test(current)) {
    console.log(`skip  ${slug} — description was edited in /admin/products:`);
    console.log(`      ${current}`);
    continue;
  }

  await ref.set({ description, updatedAt: now }, { merge: true });
  console.log(`wrote ${slug}`);
}

console.log("Done.");
process.exit(0);
