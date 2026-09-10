/**
 * One thing that goes on an item: either something it comes with, or a paid
 * extra. Stored on the product so the store can edit both lists itself.
 */
export type ItemIngredient = {
  /** Stable id, written onto cart lines and orders. Never reused for another name. */
  key: string;
  name: string;
  /** true = on the item already and removable; false = an extra to add. */
  included: boolean;
  /** Charge for adding it. Included ingredients are always 0. */
  priceCents: number;
};

/** What the customer changed: ingredient keys taken off, and extras put on. */
export type ItemMods = {
  removed: string[];
  added: string[];
};

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
   * What this item comes with and what can be added, in the order the store
   * listed them. Absent means the item is not customisable.
   */
  ingredients?: ItemIngredient[];
  /**
   * Flavor lists the store has edited, keyed by flavor group (see
   * `FLAVOR_GROUPS`). Absent means "use the list in the code". Only the choices
   * are editable — which groups an item asks for stays in code, so a stored
   * order can always be read back.
   */
  flavorOptions?: Record<string, string[]>;
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
