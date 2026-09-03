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
    slug: "banana-pudding-blue-panda-ice-cream",
    name: "Banana Pudding Blue Panda",
    description: "Banana pudding Blue Panda soft-serve ice cream.",
    imageUrl: "/assets/img/crimson/products/banana-pudding-blue-panda-ice-cream-small.png",
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
      "Philadelphia water ice (Italian ice). Flavors: watermelon, mango, cherry, pineapple, Island Breeze, blueberry lemon. This week's special is sour apple — strawberry kiwi is still available. Ask at the counter for the flavor you want.",
    imageUrl: "/assets/img/crimson/products/water-ice-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
    available: true,
  },
  {
    slug: "gelati",
    name: "Gelati",
    description:
      "Layers of creamy soft-serve ice cream with your favorite water ice. Vanilla or chocolate ice cream base, mixed with any water ice flavor. This week's special water ice is sour apple — strawberry kiwi is still available.",
    imageUrl: "/assets/img/crimson/products/gelati-small.png",
    categorySlug: "ice-cream",
    priceCents: 399,
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
  small: { label: "Small Cup", priceCents: 399 },
  large: { label: "Large Cup", priceCents: 499 },
};

export function isIceCreamItem(item: Pick<FoodItem, "categorySlug">): boolean {
  return item.categorySlug === "ice-cream";
}

/** Cup photo for the chosen size — large cup is taller than small. */
export function iceCreamCupImage(slug: string, size: IceCreamSize): string {
  return `/assets/img/crimson/products/${slug}-${size}.png`;
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
