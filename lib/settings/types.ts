/**
 * Settings shapes and constants — no Node imports, so client components can
 * import these without pulling the file-backed store into the browser bundle.
 */
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Day = (typeof DAYS)[number];

export type DayHours = { open: string; close: string; closed: boolean };

export type StoreSettings = {
  hours: Record<Day, DayHours>;
  timezone: string;
  ordersPaused: boolean;
  prepTimeMinutes: number;
  address: string;
  phone: string;
  doordashStoreUrl: string;
};

export type CheckoutSettings = {
  taxRate: number;
  taxAppliesTo: "food" | "all";
  taxIncludedInPrice: boolean;
  tipEnabled: boolean;
  tipPresets: number[];
  prepayRequiredAbove: number | null;
  phoneVerificationRequired: boolean;
};

/**
 * Points customers earn on an order and spend on the next one.
 *
 * Every number here is the store's call, not ours: how fast points build and
 * what they are worth is pricing, so the defaults are a starting point to be
 * changed in /admin/settings rather than a recommendation.
 */
export type RewardsSettings = {
  enabled: boolean;
  /** Points earned per whole dollar of an order that gets picked up. */
  pointsPerDollar: number;
  /** Points it takes to knock a dollar off the next order. */
  pointsPerDollarOff: number;
  /** Fewest points that can be spent at once, so rewards are worth saving for. */
  minRedeemPoints: number;
};

export type Settings = {
  store: StoreSettings;
  checkout: CheckoutSettings;
  rewards: RewardsSettings;
};

/** A point balance, in whole dollars off, given the store's rate. */
export function pointsToCents(points: number, rewards: RewardsSettings): number {
  if (rewards.pointsPerDollarOff <= 0) return 0;
  return Math.floor(points / rewards.pointsPerDollarOff) * 100;
}

/** Points earned by an order, from what the customer actually pays. */
export function pointsForSpend(totalCents: number, rewards: RewardsSettings): number {
  if (!rewards.enabled || rewards.pointsPerDollar <= 0 || totalCents <= 0) return 0;
  return Math.floor(totalCents / 100) * rewards.pointsPerDollar;
}
