import { getAdminDb } from "@/lib/firebase/admin";
import { foodCategories, foodItems } from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";

/**
 * Fresh food products — Firestore-backed, one document per slug.
 *
 * `lib/data/food-menu.ts` is the seed: the first read copies it into the store
 * when the collection is empty, after which admin edits win.
 */
const COLLECTION = "products";

function col() {
  return getAdminDb().collection(COLLECTION);
}

function isPlaceholder(data: FirebaseFirestore.DocumentData): boolean {
  return data._seed === true;
}

function toProduct(doc: FirebaseFirestore.QueryDocumentSnapshot): FoodItem | null {
  const data = doc.data();
  if (isPlaceholder(data)) return null;
  return data as FoodItem;
}

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export class ProductError extends Error {}

async function readAll(): Promise<FoodItem[]> {
  const snap = await col().get();
  const items = snap.docs.map(toProduct).filter((i): i is FoodItem => i !== null);
  if (items.length > 0) return items;

  // Seed an empty collection from the menu file.
  const batch = getAdminDb().batch();
  const now = new Date().toISOString();
  for (const item of foodItems) {
    batch.set(col().doc(item.slug), { ...item, updatedAt: now });
  }
  await batch.commit();
  return [...foodItems];
}


export async function listProducts(): Promise<FoodItem[]> {
  return readAll();
}

export async function listAvailableProducts(): Promise<FoodItem[]> {
  const items = await readAll();
  return items.filter((i) => !i.hidden);
}

export async function getProduct(slug: string): Promise<FoodItem | null> {
  const doc = await col().doc(slug).get();
  if (!doc.exists) return null;
  return toProduct(doc as FirebaseFirestore.QueryDocumentSnapshot);
}

export async function getVisibleProduct(slug: string): Promise<FoodItem | null> {
  const item = await getProduct(slug);
  return item && !item.hidden ? item : null;
}

export async function productsByCategory(categorySlug: string): Promise<FoodItem[]> {
  const items = await readAll();
  return items.filter((i) => i.categorySlug === categorySlug);
}

export { foodCategories };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const DEFAULT_IMAGE = "/assets/img/crimson/products/deli-sandwich.webp";

export type NewProduct = {
  name: string;
  description?: string;
  price?: string;
  categorySlug: string;
  imageUrl?: string;
};

export async function createProduct(input: NewProduct): Promise<FoodItem> {
  const name = input.name.trim();
  if (!name) throw new ProductError("Name is required.");
  if (!foodCategories.some((c) => c.slug === input.categorySlug))
    throw new ProductError("Unknown category.");

  let priceCents: number | null = null;
  const raw = (input.price ?? "").trim();
  if (raw !== "") {
    const dollars = Number(raw.replace(/[$,]/g, ""));
    if (!Number.isFinite(dollars) || dollars < 0)
      throw new ProductError("Price must be a positive number.");
    priceCents = Math.round(dollars * 100);
  }

  return serialise(async () => {
    const items = await readAll();

    const base = slugify(name);
    if (!base) throw new ProductError("That name cannot be turned into a web address.");
    let slug = base;
    let n = 2;
    while (items.some((i) => i.slug === slug)) slug = `${base}-${n++}`;

    const product: FoodItem = {
      slug,
      name,
      description: (input.description ?? "").trim(),
      imageUrl: (input.imageUrl ?? "").trim() || DEFAULT_IMAGE,
      categorySlug: input.categorySlug,
      priceCents,
      available: true,
      hidden: false,
    };

    await col().doc(slug).set({ ...product, updatedAt: new Date().toISOString() });
    return product;
  });
}

export async function deleteProduct(slug: string): Promise<FoodItem> {
  return serialise(async () => {
    const item = await getProduct(slug);
    if (!item) throw new ProductError("Product not found.");
    await col().doc(slug).delete();
    return item;
  });
}

export type ProductPatch = {
  name?: string;
  description?: string;
  price?: string;
  categorySlug?: string;
  available?: boolean;
  hidden?: boolean;
};

export async function updateProduct(
  slug: string,
  patch: ProductPatch,
): Promise<FoodItem> {
  return serialise(async () => {
    const existing = await getProduct(slug);
    if (!existing) throw new ProductError("Product not found.");

    const next: FoodItem = { ...existing };

    if (patch.name !== undefined) {
      const name = patch.name.trim();
      if (!name) throw new ProductError("Name cannot be empty.");
      next.name = name;
    }

    if (patch.description !== undefined) next.description = patch.description.trim();

    if (patch.categorySlug !== undefined) {
      if (!foodCategories.some((c) => c.slug === patch.categorySlug))
        throw new ProductError("Unknown category.");
      next.categorySlug = patch.categorySlug;
    }

    if (patch.available !== undefined) next.available = patch.available;
    if (patch.hidden !== undefined) next.hidden = patch.hidden;

    if (patch.price !== undefined) {
      const raw = patch.price.trim();
      if (raw === "") {
        next.priceCents = null;
      } else {
        const dollars = Number(raw.replace(/[$,]/g, ""));
        if (!Number.isFinite(dollars) || dollars < 0)
          throw new ProductError("Price must be a positive number.");
        next.priceCents = Math.round(dollars * 100);
      }
    }

    await col().doc(slug).set({ ...next, updatedAt: new Date().toISOString() });
    return next;
  });
}
