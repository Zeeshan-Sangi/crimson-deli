import type { CheckoutSettings } from "./types";

export type OrderTotals = {
  subtotalCents: number | null;
  taxCents: number | null;
  totalCents: number | null;
};

/** Subtotal, tax, and total from checkout settings. Server and checkout UI share this. */
export function computeOrderTotals(
  subtotalCents: number | null,
  checkout: Pick<CheckoutSettings, "taxRate" | "taxIncludedInPrice">,
): OrderTotals {
  if (subtotalCents === null) {
    return { subtotalCents: null, taxCents: null, totalCents: null };
  }
  if (checkout.taxIncludedInPrice || checkout.taxRate <= 0) {
    return { subtotalCents, taxCents: 0, totalCents: subtotalCents };
  }
  const taxCents = Math.round(subtotalCents * checkout.taxRate);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

/** e.g. 0.08 → "8%", 0.0825 → "8.25%" */
export function formatTaxRateLabel(rate: number): string {
  const pct = rate * 100;
  const rounded = Math.round(pct * 100) / 100;
  const text =
    rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/0$/, "");
  return `${text}%`;
}
