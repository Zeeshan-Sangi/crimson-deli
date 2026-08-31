/** Fresh food item — made in-store, pickup only. */
export type FoodItem = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  categorySlug: string;
  /**
   * Price in integer cents (CLAUDE.md: money is never a float).
   * `null` means the real price has not been supplied by the store yet — the UI
   * shows a placeholder rather than inventing a number.
   */
  priceCents: number | null;
  /** Sold out for today: still listed on the site, marked unavailable. */
  available: boolean;
  /**
   * Taken off the storefront entirely — not listed, and the detail page 404s.
   * Distinct from `available`: sold out is a temporary state customers should
   * see, hidden means the item is not on the menu at all right now.
   * Optional so rows written before this field stay valid.
   */
  hidden?: boolean;
};

export type FoodCategory = {
  slug: string;
  name: string;
};

/** One convenience product, read from public/data/convenience-catalog.json. */
export type ConvenienceProduct = {
  name: string;
  price: string;
  cat: string;
  catLabel: string;
  img: string;
  slug: string;
};

export type ConvenienceCatalog = {
  doordashUrl: string;
  updated: string;
  count: number;
  products: ConvenienceProduct[];
};
