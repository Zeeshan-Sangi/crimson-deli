/** One movement of a customer's point balance. Points never change silently. */
export type PointsEntry = {
  id: string;
  uid: string;
  /** Positive when earned, negative when spent. */
  delta: number;
  balanceAfter: number;
  /** `refunded` is points spent on an order the store then cancelled. */
  reason: "earned" | "redeemed" | "refunded";
  orderId: string | null;
  orderNumber: string | null;
  at: string;
};
