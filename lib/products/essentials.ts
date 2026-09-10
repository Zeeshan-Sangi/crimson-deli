import { getAdminDb } from "@/lib/firebase/admin";

/**
 * Everyday essentials the store does not actually carry.
 *
 * The catalogue in `public/data/convenience-catalog.json` was taken from the
 * DoorDash listing, so it drifts from what is really on the shelves. Rather
 * than editing that file — and redeploying — every time the store drops a line,
 * the store hides an item from /admin/essentials and the storefront skips it.
 *
 * Only slugs are stored: the catalogue stays the single source of names, prices
 * and images, and un-hiding an item brings it back exactly as it was.
 */
const COLLECTION = "meta";
const DOC = "essentials";

function ref() {
  return getAdminDb().collection(COLLECTION).doc(DOC);
}

function readHidden(data: FirebaseFirestore.DocumentData | undefined): string[] {
  const hidden = data?.hidden;
  return Array.isArray(hidden) ? hidden.filter((s): s is string => typeof s === "string") : [];
}

export async function hiddenEssentialSlugs(): Promise<Set<string>> {
  try {
    const snap = await ref().get();
    return new Set(readHidden(snap.data()));
  } catch {
    // The catalogue is public reference data. If Firestore is unreachable the
    // storefront lists all of it rather than showing an empty shop.
    return new Set();
  }
}

/** Hides or restores one catalogue item. Returns the full hidden list. */
export async function setEssentialHidden(
  slug: string,
  hidden: boolean,
): Promise<string[]> {
  const db = getAdminDb();
  const doc = ref();
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(doc);
    const current = readHidden(snap.data());
    const next = hidden
      ? [...new Set([...current, slug])]
      : current.filter((s) => s !== slug);
    tx.set(doc, { hidden: next, updatedAt: new Date().toISOString() }, { merge: true });
    return next;
  });
}
