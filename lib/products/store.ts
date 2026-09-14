import { getAdminDb } from "@/lib/firebase/admin";
import { FLAVOR_GROUPS, foodCategories, foodItems, isIceCreamItem } from "@/lib/data/food-menu";
import { NUTRITION_FIELDS } from "@/lib/data/nutrition";
import type { FoodItem, ItemIngredient, Nutrition } from "@/lib/data/types";

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

const DEFAULT_IMAGE = "/assets/img/crimson/products/deli-sandwich.png";

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
  /** Flavor lists, keyed by flavor group. An empty list restores the default. */
  flavorOptions?: Record<string, string[]>;
  /**
   * What the item comes with and what can be added, as the store typed them.
   * Two lists in, one ordered list out. An empty pair turns customising off.
   */
  ingredients?: { comesWith?: string; extras?: string };
  /** The label as typed, one box per row. All boxes blank removes the label. */
  nutrition?: Record<string, string> | null;
  /** The large cup's label, for items sold in two cup sizes. */
  nutritionLarge?: Record<string, string> | null;
  /**
   * Photo path and label per ingredient, keyed by ingredient key. Only
   * ingredients already on the item are touched; an unknown key is ignored.
   */
  ingredientDetails?: Record<
    string,
    { imageUrl?: string; nutrition?: Record<string, string> | null }
  >;
};

const MAX_NUTRITION_VALUE = 100_000;

/**
 * Reads a label from the admin form.
 *
 * All boxes blank means no label. Some filled and some blank is refused rather
 * than saved: a blank row would print as 0 on the label, which is a claim the
 * store never made. Zero has to be typed.
 */
function parseNutrition(input: unknown, what: string): Nutrition | undefined {
  if (input === null || input === undefined) return undefined;
  if (typeof input !== "object" || Array.isArray(input))
    throw new ProductError(`Nutrition for ${what} must be a set of numbers.`);

  const raw = input as Record<string, unknown>;
  const text = (key: string) => String(raw[key] ?? "").trim();
  const blank = NUTRITION_FIELDS.filter((f) => text(f.key) === "");
  if (blank.length === NUTRITION_FIELDS.length) return undefined;
  if (blank.length > 0)
    throw new ProductError(
      `Nutrition for ${what} is missing ${blank.map((f) => f.label).join(", ")}. ` +
        "Fill in every row, typing 0 where it is zero, or clear them all.",
    );

  const facts = {} as Nutrition;
  for (const field of NUTRITION_FIELDS) {
    const value = Number(text(field.key));
    if (!Number.isFinite(value) || value < 0 || value > MAX_NUTRITION_VALUE)
      throw new ProductError(`${field.label} for ${what} must be a number, 0 or more.`);
    facts[field.key] = value;
  }
  return facts;
}

/** An ingredient photo: a site path like the product image, or an https URL. */
function cleanImagePath(input: unknown, what: string): string | undefined {
  const value = String(input ?? "").trim();
  if (value === "") return undefined;
  if (value.length > 300 || !(value.startsWith("/") || value.startsWith("https://")))
    throw new ProductError(
      `The photo for ${what} must be a path starting with / or an https:// address.`,
    );
  return value;
}

const MAX_INGREDIENTS = 40;
const MAX_INGREDIENT_LENGTH = 60;

/**
 * Reads the two ingredient boxes from /admin/products.
 *
 * "Comes with" is one name per line. "Extras" is a name with an optional price
 * after it — `Extra cheese 1.00`, `Bacon $1.50` and `Avocado, 2` all work —
 * because a store writing a list should not have to learn a syntax.
 */
function parseIngredients(input: { comesWith?: string; extras?: string }): ItemIngredient[] {
  const out: ItemIngredient[] = [];
  const seen = new Set<string>();

  const lines = (text: string | undefined) =>
    (text ?? "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  const push = (rawName: string, priceCents: number, included: boolean) => {
    const name = rawName.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (name.length > MAX_INGREDIENT_LENGTH)
      throw new ProductError(`"${name.slice(0, 20)}…" is too long for an ingredient.`);
    const key = slugify(name);
    if (!key) throw new ProductError(`"${name}" cannot be used as an ingredient name.`);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ key, name, included, priceCents });
  };

  for (const line of lines(input.comesWith)) push(line, 0, true);

  for (const line of lines(input.extras)) {
    // A trailing number is the charge; everything before it is the name.
    const match = line.match(/^(.*?)[\s,|]*\$?(\d+(?:\.\d{1,2})?)$/);
    const name = match ? match[1] : line;
    const dollars = match ? Number(match[2]) : 0;
    if (!Number.isFinite(dollars) || dollars < 0)
      throw new ProductError(`"${line}" does not have a valid price.`);
    push(name, Math.round(dollars * 100), false);
  }

  if (out.length > MAX_INGREDIENTS)
    throw new ProductError(`An item cannot list more than ${MAX_INGREDIENTS} ingredients.`);
  return out;
}


const MAX_FLAVORS = 40;
const MAX_FLAVOR_LENGTH = 60;

/**
 * Cleans a submitted flavor list: trimmed, de-duplicated, order preserved.
 *
 * These strings end up on order slips and in `lineKey`s, so an empty entry or a
 * stray duplicate would show up as a blank or repeated button on the menu.
 */
function cleanFlavorOptions(
  slug: string,
  input: Record<string, string[]>,
): Record<string, string[]> {
  const groups = FLAVOR_GROUPS[slug] ?? [];
  if (groups.length === 0)
    throw new ProductError("This item does not ask the customer for a flavor.");

  const cleaned: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(input)) {
    const group = groups.find((g) => g.key === key);
    if (!group) throw new ProductError(`Unknown flavor list: ${key}.`);
    if (!Array.isArray(values)) throw new ProductError(`${group.label} must be a list.`);

    const seen = new Set<string>();
    const list: string[] = [];
    for (const value of values) {
      const flavor = String(value ?? "").trim().replace(/\s+/g, " ");
      if (!flavor) continue;
      if (flavor.length > MAX_FLAVOR_LENGTH)
        throw new ProductError(`"${flavor.slice(0, 20)}…" is too long for ${group.label}.`);
      const dedupeKey = flavor.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      list.push(flavor);
    }
    if (list.length > MAX_FLAVORS)
      throw new ProductError(`${group.label} cannot hold more than ${MAX_FLAVORS} flavors.`);
    cleaned[key] = list;
  }
  return cleaned;
}

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

    if (patch.ingredients !== undefined) {
      // The lists are retyped as text on every save, so an ingredient that is
      // still there keeps the photo and label it already had.
      const previous = new Map((existing.ingredients ?? []).map((i) => [i.key, i]));
      const list = parseIngredients(patch.ingredients).map((i) => ({
        ...i,
        imageUrl: previous.get(i.key)?.imageUrl,
        nutrition: previous.get(i.key)?.nutrition,
      }));
      next.ingredients = list.length > 0 ? list : undefined;
    }

    if (patch.ingredientDetails !== undefined) {
      const details = patch.ingredientDetails;
      if (typeof details !== "object" || details === null || Array.isArray(details))
        throw new ProductError("Ingredient details must be keyed by ingredient.");
      next.ingredients = next.ingredients?.map((i) => {
        const detail = details[i.key];
        if (!detail) return i;
        return {
          ...i,
          imageUrl:
            detail.imageUrl !== undefined ? cleanImagePath(detail.imageUrl, i.name) : i.imageUrl,
          nutrition:
            detail.nutrition !== undefined
              ? parseNutrition(detail.nutrition, i.name)
              : i.nutrition,
        };
      });
    }

    if (patch.nutrition !== undefined) {
      next.nutrition = parseNutrition(patch.nutrition, next.name);
    }

    if (patch.nutritionLarge !== undefined) {
      const large = parseNutrition(patch.nutritionLarge, `${next.name} (large cup)`);
      if (large && !isIceCreamItem(next))
        throw new ProductError("Only items sold in two cup sizes have a large-cup label.");
      next.nutritionLarge = large;
    }

    if (patch.flavorOptions !== undefined) {
      const cleaned = cleanFlavorOptions(slug, patch.flavorOptions);
      const merged = { ...(existing.flavorOptions ?? {}), ...cleaned };
      // An emptied list means "go back to the menu file", so it is dropped
      // rather than stored as an item with no flavors to choose from.
      for (const key of Object.keys(merged)) {
        if (merged[key].length === 0) delete merged[key];
      }
      next.flavorOptions = Object.keys(merged).length > 0 ? merged : undefined;
    }

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
