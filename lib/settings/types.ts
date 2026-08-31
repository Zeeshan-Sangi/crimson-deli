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

export type Settings = { store: StoreSettings; checkout: CheckoutSettings };
