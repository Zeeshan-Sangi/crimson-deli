/** A customer review of one fresh-food item. */
export type Review = {
  id: string;
  /** FoodItem.slug the review belongs to. */
  productSlug: string;
  /** Display name as typed by the customer. */
  name: string;
  /** Whole stars, 1–5. */
  rating: number;
  body: string;
  createdAt: string;
};

/** Aggregate shown next to the product title. */
export type ReviewSummary = {
  count: number;
  /** Mean rating to one decimal, or null when there are no reviews yet. */
  average: number | null;
  /** How many reviews sit at each star level, index 0 = 1 star. */
  distribution: number[];
};

export const MIN_RATING = 1;
export const MAX_RATING = 5;
