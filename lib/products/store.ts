import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { foodCategories, foodItems } from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";

/**
 * Fresh food products — the editable source of truth.
 *
 * `lib/data/food-menu.ts` is the seed: the first read copies it into the store,
 * after which admin edits (price, availability, description) win. Storefront
 * pages read through here, so a sold-out toggle takes effect immediately.
 *
 * Interim JSON storage, same as orders and users — Firestore replaces the file
 * IO below without changing any caller.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "products.json");

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export class ProductError extends Error {}

async function readAll(): Promise<FoodItem[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as FoodItem[];
  } catch {
    // fall through to the seed
  }
  return foodItems;
}

async function writeAll(items: FoodItem[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function listProducts(): Promise<FoodItem[]> {
  return readAll();
}

/**
 * What customers see. Sold-out items stay listed and are marked unavailable —
 * that is information a customer wants. Hidden items are dropped entirely.
 */
export async function listAvailableProducts(): Promise<FoodItem[]> {
  const items = await readAll();
  return items.filter((i) => !i.hidden);
}

export async function getProduct(slug: string): Promise<FoodItem | null> {
  const items = await readAll();
  return items.find((i) => i.slug === slug) ?? null;
}

/** Storefront lookup: a hidden item reads as missing, so its page 404s. */
export async function getVisibleProduct(slug: string): Promise<FoodItem | null> {
  const item = await getProduct(slug);
  return item && !item.hidden ? item : null;
}

export async function productsByCategory(categorySlug: string): Promise<FoodItem[]> {
  const items = await readAll();
  return items.filter((i) => i.categorySlug === categorySlug);
}

export { foodCategories };

/** Slugifies a product name; collisions get a numeric suffix. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Fallback art for a new item until the store supplies a photo. */
const DEFAULT_IMAGE = "/assets/img/crimson/products/deli-sandwich.webp";

export type NewProduct = {
  name: string;
  description?: string;
  /** Dollars as typed. Blank leaves the item unpriced. */
  price?: string;
  categorySlug: string;
  imageUrl?: string;
};

/**
 * Adds a product to the catalogue.
 *
 * The seed in `food-menu.ts` stays untouched — this writes to the store, which
 * is what every storefront page reads.
 */
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

    await writeAll([...items, product]);
    return product;
  });
}

/**
 * Removes a product permanently.
 *
 * Past orders keep their own copy of the item name and price, so deleting here
 * never rewrites order history.
 */
export async function deleteProduct(slug: string): Promise<FoodItem> {
  return serialise(async () => {
    const items = await readAll();
    const i = items.findIndex((p) => p.slug === slug);
    if (i === -1) throw new ProductError("Product not found.");
    const [removed] = items.splice(i, 1);
    await writeAll(items);
    return removed;
  });
}

export type ProductPatch = {
  name?: string;
  description?: string;
  /** Dollars as typed by staff; converted to integer cents here. Empty clears it. */
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
    const items = await readAll();
    const i = items.findIndex((p) => p.slug === slug);
    if (i === -1) throw new ProductError("Product not found.");

    const next: FoodItem = { ...items[i] };

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
        // Blank means "still unpriced" — that is a real state, not zero.
        next.priceCents = null;
      } else {
        const dollars = Number(raw.replace(/[$,]/g, ""));
        if (!Number.isFinite(dollars) || dollars < 0)
          throw new ProductError("Price must be a positive number.");
        // Money is stored as integer cents (CLAUDE.md §10) — never a float.
        next.priceCents = Math.round(dollars * 100);
      }
    }

    items[i] = next;
    await writeAll(items);
    return next;
  });
}
