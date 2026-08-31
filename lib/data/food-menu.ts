import type { FoodCategory, FoodItem } from "./types";

/**
 * The fresh food menu, exactly as the store supplied it.
 *
 * Prices are deliberately `null`: the real in-store prices have not been given
 * to us yet, and CLAUDE.md forbids inventing them. `formatFoodPrice` renders the
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
    priceCents: 800,
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
    imageUrl: "/assets/img/crimson/products/deli-sandwich.webp",
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
    imageUrl: "/assets/img/crimson/products/vanilla-ice-cream.webp",
    categorySlug: "ice-cream",
    priceCents: 300,
    available: true,
  },
  {
    slug: "chocolate-ice-cream",
    name: "Chocolate Ice Cream",
    description: "Chocolate soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/chocolate-ice-cream.webp",
    categorySlug: "ice-cream",
    priceCents: 300,
    available: true,
  },
  {
    slug: "mango-ice-cream",
    name: "Mango Ice Cream",
    description: "Mango soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/mango-ice-cream.webp",
    categorySlug: "ice-cream",
    priceCents: 300,
    available: true,
  },
  {
    slug: "strawberry-ice-cream",
    name: "Strawberry Ice Cream",
    description: "Strawberry soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/strawberry-ice-cream.webp",
    categorySlug: "ice-cream",
    priceCents: 300,
    available: true,
  },
];

/** Placeholder shown wherever the store has not given us a real price yet. */
export const PRICE_PLACEHOLDER = "TODO: real price";

export type IceCreamSize = "small" | "large";

export const ICE_CREAM_SIZES: Record<
  IceCreamSize,
  { label: string; priceCents: number }
> = {
  small: { label: "Small Cup", priceCents: 300 },
  large: { label: "Large Cup", priceCents: 500 },
};

export function isIceCreamItem(item: Pick<FoodItem, "categorySlug">): boolean {
  return item.categorySlug === "ice-cream";
}

export function iceCreamPriceCents(size: IceCreamSize): number {
  return ICE_CREAM_SIZES[size].priceCents;
}

export function formatFoodPrice(priceCents: number | null): string {
  if (priceCents === null) return PRICE_PLACEHOLDER;
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function getFoodItem(slug: string): FoodItem | undefined {
  return foodItems.find((i) => i.slug === slug);
}

export function itemsByCategory(categorySlug: string): FoodItem[] {
  return foodItems.filter((i) => i.categorySlug === categorySlug);
}
