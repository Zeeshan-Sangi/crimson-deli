/** One movement of a customer's point balance. Points never change silently. */
export type PointsEntry = {
  id: string;
  uid: string;
  /** Positive when earned, negative when spent. */
  delta: number;
  balanceAfter: number;
  reason: "earned" | "redeemed";
  orderId: string | null;
  orderNumber: string | null;
  at: string;
};
