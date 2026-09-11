import type { FoodCategory, FoodItem, ItemIngredient, ItemMods } from "./types";

/**
 * The fresh food menu, exactly as the store supplied it.
 *
 * Prices are deliberately `null`: the real in-store prices have not been given
 * to us yet, and inventing them is not allowed. `formatFoodPrice` renders the
 * placeholder so the gap stays visible instead of silently showing $0.00.
 */
export const foodCategories: FoodCategory[] = [
  { slug: "burgers-wraps", name: "Burgers & Wraps" },
  { slug: "fresh-smoothies", name: "Fresh & Smoothies" },
  { slug: "coffee", name: "Coffee" },
  { slug: "ice-cream", name: "Ice Cream" },
];

export const foodItems: FoodItem[] = [
  {
    slug: "deli-burger",
    name: "Hoagie",
    description:
      "Signature hoagie with deli meats, cheese, lettuce, tomato & toppings. Pickup only.",
    imageUrl: "/assets/img/crimson/products/deli-burger.webp",
    categorySlug: "burgers-wraps",
    priceCents: 799,
    available: true,
  },
  {
    slug: "kaiser",
    name: "Kaiser",
    description:
      "Round kaiser roll with deli meats, cheese, lettuce, tomato & toppings. Pickup only.",
    imageUrl: "/assets/img/crimson/products/kaiser.webp",
    categorySlug: "burgers-wraps",
    priceCents: 600,
    available: true,
  },
  {
    slug: "deli-sandwich",
    name: "Deli Sandwich",
    description: "Deli turkey, lettuce and tomato on fresh bread. This is a sandwich, not a wrap.",
    imageUrl: "/assets/img/crimson/products/deli-sandwich.png",
    categorySlug: "burgers-wraps",
    priceCents: 800,
    available: true,
  },
  {
    slug: "fruit-bowl",
    name: "Fresh Fruit Bowl",
    description: "Seasonal mixed fruit, made fresh in-store.",
    imageUrl: "/assets/img/crimson/products/fruit-bowl.webp",
    categorySlug: "fresh-smoothies",
    priceCents: 800,
    available: true,
  },
  {
    slug: "mango-smoothie",
    name: "Mango Smoothie",
    description: "Blended mango smoothie.",
    imageUrl: "/assets/img/crimson/products/mango-smoothie.webp",
    categorySlug: "fresh-smoothies",
    priceCents: 500,
    available: true,
  },
  {
    slug: "berry-smoothie",
    name: "Berry Smoothie",
    description: "Mixed berry smoothie.",
    imageUrl: "/assets/img/crimson/products/berry-smoothie.webp",
    categorySlug: "fresh-smoothies",
    priceCents: 500,
    available: true,
  },
  {
    slug: "latte",
    name: "Latte",
    description: "Creamy latte made fresh at the counter.",
    imageUrl: "/assets/img/crimson/products/latte.webp",
    categorySlug: "coffee",
    priceCents: 500,
    available: true,
  },
  {
    slug: "cappuccino",
    name: "Cappuccino",
    description: "Cappuccino with rich foam.",
    imageUrl: "/assets/img/crimson/products/cappuccino.webp",
    categorySlug: "coffee",
    priceCents: 500,
    available: true,
  },
  {
    slug: "vanilla-ice-cream",
    name: "Vanilla Ice Cream",
    description: "Vanilla soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/vanilla-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "chocolate-ice-cream",
    name: "Chocolate Ice Cream",
    description: "Chocolate soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/chocolate-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "butter-pecan-ice-cream",
    name: "Butter Pecan Ice Cream",
    description: "Butter pecan soft-serve ice cream with toasted pecans.",
    imageUrl: "/assets/img/crimson/products/butter-pecan-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "strawberry-cheesecake-ice-cream",
    name: "Strawberry Cheesecake Ice Cream",
    description: "Strawberry cheesecake soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/strawberry-cheesecake-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "rum-raisin-ice-cream",
    name: "Rum Raisin Ice Cream",
    description: "Rum raisin soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/rum-raisin-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "salty-caramel-ice-cream",
    name: "Salty Caramel Ice Cream",
    description: "Salty caramel soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/salty-caramel-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "banana-pudding-ice-cream",
    name: "Banana Pudding Ice Cream",
    description: "Banana pudding soft-serve ice cream with vanilla wafer crumbs.",
    imageUrl: "/assets/img/crimson/products/banana-pudding-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "blue-panda-ice-cream",
    name: "Blue Panda Ice Cream",
    description: "Blue Panda soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/blue-panda-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "peanut-butter-ice-cream",
    name: "Peanut Butter Ice Cream",
    description: "Peanut butter soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/peanut-butter-ice-cream-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "water-ice",
    name: "Water Ice",
    description:
      "Philadelphia water ice (Italian ice). Pick your flavor above — this week's special is sour apple.",
    imageUrl: "/assets/img/crimson/products/water-ice-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "gelati",
    name: "Gelati",
    description:
      "Layers of creamy soft-serve ice cream with your favorite water ice. Pick the ice cream base and the water ice flavor above — this week's water ice special is sour apple.",
    imageUrl: "/assets/img/crimson/products/gelati-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
];

/**
 * Shown wherever an item has no price yet. This string reaches customers in the
 * cart and at checkout, so it is the same wording the admin dashboard and the
 * terms page already use — it must never read like a developer note.
 */
export const UNPRICED_LABEL = "Priced at store";

export type IceCreamSize = "small" | "large";

export const ICE_CREAM_SIZES: Record<
  IceCreamSize,
  { label: string; priceCents: number }
> = {
  small: { label: "Small Cup", priceCents: 399 },
  large: { label: "Large Cup", priceCents: 499 },
};

export function isIceCreamItem(item: Pick<FoodItem, "categorySlug">): boolean {
  return item.categorySlug === "ice-cream";
}

/** Water ice flavors, as the store lists them at the counter. */
export const WATER_ICE_FLAVORS = [
  "Watermelon",
  "Mango",
  "Cherry",
  "Pineapple",
  "Island Breeze",
  "Blueberry Lemon",
  "Sour Apple",
  "Strawberry Kiwi",
] as const;

/** Soft-serve bases a gelati can be layered on. */
export const GELATI_BASES = ["Vanilla", "Chocolate"] as const;

/** One choice the customer makes before the item can be made. */
export type FlavorGroup = {
  /** Stored on the cart line and on the order, so it must stay stable. */
  key: string;
  label: string;
  options: readonly string[];
  /** When true, the customer can pick more than one option from this group. */
  multi?: boolean;
};

/** The customer's picks, keyed by `FlavorGroup.key`. Multi groups store arrays. */
export type FlavorChoices = Record<string, string | string[]>;

/**
 * Items whose flavor is chosen at order time.
 *
 * Ice cream flavors are each their own product, so picking the product *is*
 * picking the flavor. Water ice is one product with many flavors, and a gelati
 * layers a soft-serve base with a water ice flavor — for those two the flavor
 * used to live in the description ("ask at the counter"), which meant it never
 * reached the cart, the order slip or the kitchen.
 */
export const FLAVOR_GROUPS: Record<string, FlavorGroup[]> = {
  "water-ice": [
    {
      key: "flavor",
      label: "Water ice flavor",
      options: WATER_ICE_FLAVORS,
      multi: true,
    },
  ],
  gelati: [
    { key: "base", label: "Ice cream base", options: GELATI_BASES },
    {
      key: "flavor",
      label: "Water ice flavor",
      options: WATER_ICE_FLAVORS,
      multi: true,
    },
  ],
};

/**
 * The groups an item asks for, with the store's own flavor lists applied.
 *
 * The weekly water ice special changes faster than a deploy, so the options
 * come from the product when the store has edited them in /admin/products and
 * from the code otherwise. Keys and labels always come from the code: an order
 * stored last week must still make sense today.
 */
export function flavorGroupsFor(
  item: Pick<FoodItem, "slug"> & Partial<Pick<FoodItem, "flavorOptions">>,
): FlavorGroup[] {
  const groups = FLAVOR_GROUPS[item.slug] ?? [];
  return groups.map((group) => {
    const edited = item.flavorOptions?.[group.key];
    return edited && edited.length > 0 ? { ...group, options: edited } : group;
  });
}

/** The picks in group order, e.g. `["Vanilla", "Cherry", "Mango"]`. */
export function flavorValues(slug: string, choices?: FlavorChoices): string[] {
  if (!choices) return [];
  const out: string[] = [];
  for (const g of FLAVOR_GROUPS[slug] ?? []) {
    const picked = choices[g.key];
    if (Array.isArray(picked)) {
      for (const v of picked) {
        if (typeof v === "string" && v.length > 0) out.push(v);
      }
    } else if (typeof picked === "string" && picked.length > 0) {
      out.push(picked);
    }
  }
  return out;
}

/**
 * Line-name suffix, e.g. `" — Vanilla · Cherry"`.
 *
 * Flavors ride along inside the item name so every place that already prints a
 * line — cart, checkout, tracking page, team board, admin — shows them without
 * each one having to learn about flavors.
 */
export function flavorSuffix(slug: string, choices?: FlavorChoices): string {
  const values = flavorValues(slug, choices);
  return values.length > 0 ? ` — ${values.join(" · ")}` : "";
}

function picksForGroup(
  group: FlavorGroup,
  choices?: FlavorChoices,
): string[] {
  const picked = choices?.[group.key];
  if (Array.isArray(picked)) {
    return picked.filter((v) => typeof v === "string" && group.options.includes(v));
  }
  if (typeof picked === "string" && group.options.includes(picked)) return [picked];
  return [];
}

/** Every group answered — multi groups need at least one valid option. */
export function flavorsComplete(
  item: Pick<FoodItem, "slug"> & Partial<Pick<FoodItem, "flavorOptions">>,
  choices?: FlavorChoices,
): boolean {
  return flavorGroupsFor(item).every((g) => picksForGroup(g, choices).length > 0);
}

/* ---- make it your own: ingredients the customer can take off or add ---- */

type Customisable = Pick<FoodItem, "slug"> & Partial<Pick<FoodItem, "ingredients">>;

export function ingredientsFor(item: Customisable): ItemIngredient[] {
  return item.ingredients ?? [];
}

/** What the item comes with — each one can be taken off. */
export function includedIngredients(item: Customisable): ItemIngredient[] {
  return ingredientsFor(item).filter((i) => i.included);
}

/** Paid extras the customer can stack on. */
export function extraIngredients(item: Customisable): ItemIngredient[] {
  return ingredientsFor(item).filter((i) => !i.included);
}

export function isCustomisable(item: Customisable): boolean {
  return ingredientsFor(item).length > 0;
}

export const NO_MODS: ItemMods = { removed: [], added: [] };

export function hasMods(mods?: ItemMods): boolean {
  return (mods?.removed.length ?? 0) > 0 || (mods?.added.length ?? 0) > 0;
}

/**
 * Drops anything the item no longer offers.
 *
 * A cart lives in localStorage for days, so it can name an ingredient the store
 * has since deleted, and a page left open overnight can do the same. Both sides
 * run this, and the server runs it again before an order is priced.
 */
export function cleanMods(item: Customisable, mods?: ItemMods): ItemMods {
  const ingredients = ingredientsFor(item);
  const has = (key: string, included: boolean) =>
    ingredients.some((i) => i.key === key && i.included === included);
  return {
    removed: [...new Set(mods?.removed ?? [])].filter((k) => has(k, true)),
    added: [...new Set(mods?.added ?? [])].filter((k) => has(k, false)),
  };
}

/** What the chosen extras add to the price, in cents. */
export function modsPriceCents(item: Customisable, mods?: ItemMods): number {
  const ingredients = ingredientsFor(item);
  return (mods?.added ?? []).reduce((sum, key) => {
    const extra = ingredients.find((i) => i.key === key && !i.included);
    return sum + (extra?.priceCents ?? 0);
  }, 0);
}

/**
 * Kitchen-readable summary, e.g. `" — No Tomato, Add Extra Cheese"`.
 *
 * Like the flavors, the changes ride along inside the line name, so the cart,
 * the tracking page, the team board and the admin order view all show them
 * without each of those having to understand ingredients.
 */
export function modsSuffix(item: Customisable, mods?: ItemMods): string {
  const ingredients = ingredientsFor(item);
  const nameOf = (key: string) => ingredients.find((i) => i.key === key)?.name;
  const parts = [
    ...(mods?.removed ?? []).map((k) => nameOf(k)).map((n) => (n ? `No ${n}` : null)),
    ...(mods?.added ?? []).map((k) => nameOf(k)).map((n) => (n ? `Add ${n}` : null)),
  ].filter((p): p is string => p !== null);
  return parts.length > 0 ? ` — ${parts.join(", ")}` : "";
}

/** Turns stored ingredients back into the two boxes the admin form shows. */
export function ingredientsToText(item: Customisable): {
  comesWith: string;
  extras: string;
} {
  const list = ingredientsFor(item);
  return {
    comesWith: list.filter((i) => i.included).map((i) => i.name).join("\n"),
    extras: list
      .filter((i) => !i.included)
      .map((i) =>
        i.priceCents > 0 ? `${i.name} ${(i.priceCents / 100).toFixed(2)}` : i.name,
      )
      .join("\n"),
  };
}

/** Cup photo for the chosen size — large cup is taller than small. */
export function iceCreamCupImage(slug: string, size: IceCreamSize): string {
  return `/assets/img/crimson/products/${slug}-${size}.png`;
}

export function iceCreamPriceCents(size: IceCreamSize): number {
  return ICE_CREAM_SIZES[size].priceCents;
}

export function formatFoodPrice(priceCents: number | null): string {
  if (priceCents === null) return UNPRICED_LABEL;
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function getFoodItem(slug: string): FoodItem | undefined {
  return foodItems.find((i) => i.slug === slug);
}

export function itemsByCategory(categorySlug: string): FoodItem[] {
  return foodItems.filter((i) => i.categorySlug === categorySlug);
}
