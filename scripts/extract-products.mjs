/**
 * One-off bootstrap: lift the product catalogue out of the template markup into
 * typed data, so pages can render (and search) it instead of hard-coding cards.
 *
 * Run once — src/data/products.ts is hand-maintained after that (and will be
 * swapped for a real backend later).
 * Usage: node scripts/extract-products.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";

const CARD = /<div className="food-category-items-4">([\s\S]*?)<span className="price">([^<]+)<\/span>/g;

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const products = new Map();

for (const file of globSync("src/components/template/*.tsx")) {
  const src = readFileSync(file, "utf8");
  CARD.lastIndex = 0;
  let m;
  while ((m = CARD.exec(src))) {
    const [, body, rawPrice] = m;
    const name = /<h2 className="t[^"]*">\s*<Link[^>]*>([^<]+)/.exec(body)?.[1]?.trim();
    const image = /thumb">\s*<Image src="([^"]+)"/.exec(body)?.[1];
    if (!name || !image) continue;

    const price = Number(rawPrice.replace(/[^0-9.]/g, ""));
    const rating = (body.match(/fa-solid fa-star/g) || []).length;
    const sizes = (/options=\{\[([^\]]+)\]\}/.exec(body)?.[1] ?? '"Large", "Medium", "Small"')
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""));

    const id = slug(name);
    if (!products.has(id)) products.set(id, { id, name, price, image, rating, sizes });
  }
}

const list = [...products.values()].sort((a, b) => a.name.localeCompare(b.name));

const out = `/**
 * Product catalogue, bootstrapped from the template markup by
 * scripts/extract-products.mjs and maintained by hand from here on.
 */

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  sizes: string[];
};

export const PRODUCTS: Product[] = ${JSON.stringify(list, null, 2)};

/** Case-insensitive name match used by the header search box. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
`;

writeFileSync("src/data/products.ts", out);
console.log(`wrote src/data/products.ts with ${list.length} products`);
