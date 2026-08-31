import type { ConvenienceCatalog, ConvenienceProduct } from "./types";

/**
 * Convenience catalog loader.
 *
 * The interim page fetched this JSON in the browser; here it is read on the
 * server so the catalog is in the HTML on first paint. Cached per process —
 * the file only changes on deploy.
 *
 * NOTE: prices in this file came from the DoorDash listing and are marked up.
 * CLAUDE.md wants the store's own in-store price list instead; until that
 * arrives these are shown as DoorDash prices and labelled as such.
 */
let cached: ConvenienceCatalog | null = null;

/**
 * Imported rather than read from disk: the catalogue is static reference data
 * that ships with the build, and a runtime `readFile` under `public/` depends
 * on serverless file tracing including it.
 */
export async function getCatalog(): Promise<ConvenienceCatalog> {
  if (cached) return cached;
  const mod = await import("@/public/data/convenience-catalog.json");
  cached = (mod.default ?? mod) as unknown as ConvenienceCatalog;
  return cached;
}

/** Store departments, in the order the storefront lists them. */
export const convenienceCategories = [
  { slug: "dairy-eggs", name: "Dairy & Eggs" },
  { slug: "pantry", name: "Pantry" },
  { slug: "frozen", name: "Frozen" },
  { slug: "drinks", name: "Drinks" },
  { slug: "snacks", name: "Snacks" },
  { slug: "candy", name: "Candy" },
  { slug: "household", name: "Household" },
  // The catalogue files four drinks under `mixed`; without an entry here they
  // are unreachable from any department page. "Essentials" is the label the
  // data itself carries for them.
  { slug: "mixed", name: "Essentials" },
] as const;

export type ConvenienceCategory = (typeof convenienceCategories)[number];

export function categoryImage(slug: string): string {
  return `/assets/img/crimson/convenience/categories/${slug}.png`;
}

export function getCategory(slug: string): ConvenienceCategory | undefined {
  return convenienceCategories.find((c) => c.slug === slug);
}

export async function productsInCategory(slug: string): Promise<ConvenienceProduct[]> {
  const { products } = await getCatalog();
  return products.filter((p) => p.cat === slug);
}

/**
 * Departments that actually have stock, in storefront order.
 *
 * Three declared departments (pantry, snacks, household) have no catalogued
 * products, and listing them gives the customer three dead ends — so the
 * storefront asks for this rather than the raw list.
 */
export async function stockedCategories(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const counts = await categoryCounts();
  return convenienceCategories
    .map((c) => ({ slug: c.slug, name: c.name, count: counts[c.slug] ?? 0 }))
    .filter((c) => c.count > 0);
}

/** How many catalogued products sit in each department. */
export async function categoryCounts(): Promise<Record<string, number>> {
  const { products } = await getCatalog();
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.cat] = (acc[p.cat] ?? 0) + 1;
    return acc;
  }, {});
}
