/** Order lifecycle from the project brief §5. No delivery stage — fresh food is pickup only. */
export const ORDER_STATUSES = [
  "received",
  "preparing",
  "packed",
  "picked_up",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The forward path staff advance through. `cancelled` is reachable from any state. */
export const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  received: "preparing",
  preparing: "packed",
  packed: "picked_up",
  picked_up: null,
  cancelled: null,
};

export type OrderItem = {
  productSlug: string;
  name: string;
  /** Cents, or null while the store has not given us a real price. */
  priceCents: number | null;
  qty: number;
  /** Ice cream cup size chosen at checkout. */
  size?: "small" | "large";
  /** Ingredients taken off and extras added on, by ingredient key. */
  mods?: { removed: string[]; added: string[] };
  /**
   * Flavors chosen at checkout, keyed by flavor group — e.g. a gelati carries
   * `{ base: "Vanilla", flavor: ["Cherry", "Mango"] }`. Also spelled out in
   * `name`, so anything that only prints the name still shows the flavor.
   */
  flavors?: Record<string, string | string[]>;
};

/**
 * Stable list key for an order line: the same product in two cup sizes, or in
 * two water ice flavors, is two lines and must not share a React key.
 */
export function orderItemKey(item: OrderItem): string {
  const modParts = [
    ...(item.mods?.removed ?? []).map((k) => `-${k}`),
    ...(item.mods?.added ?? []).map((k) => `+${k}`),
  ];
  const flavorParts = Object.values(item.flavors ?? {}).flatMap((v) =>
    Array.isArray(v) ? v : [v],
  );
  return [item.productSlug, item.size, ...flavorParts, ...modParts]
    .filter(Boolean)
    .join(":");
}

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string | null;
  uid: string | null;
};

export type StatusEvent = {
  status: OrderStatus;
  at: string;
  byUid: string | null;
};

export type Order = {
  id: string;
  /** Short human-readable reference, e.g. CD-2481. */
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  /** Null when any line has no known price yet — never guess a total. */
  subtotalCents: number | null;
  /** Sales tax in cents. Zero when tax is included in prices or the rate is 0. */
  taxCents: number | null;
  /** Knocked off by reward points, already reflected in `totalCents`. */
  discountCents?: number;
  /** Points spent on this order, and points it earned once picked up. */
  pointsSpent?: number;
  pointsEarned?: number;
  totalCents: number | null;
  paymentMethod: "prepaid" | "pay_at_store";
  paymentStatus: "unpaid" | "paid" | "refunded";
  customer: OrderCustomer;
  isGuest: boolean;
  notes: string | null;
  /** Unguessable token for the public /order/[token] page. */
  trackingToken: string;
  statusHistory: StatusEvent[];
  createdAt: string;
  updatedAt: string;
};

/** What the checkout form sends. Prices and totals are NOT trusted from here. */
export type CreateOrderInput = {
  items: {
    productSlug: string;
    qty: number;
    size?: "small" | "large";
    flavors?: Record<string, string | string[]>;
    mods?: { removed: string[]; added: string[] };
  }[];
  customer: { name: string; phone: string; email?: string };
  notes?: string;
  /** Reward points the customer asked to spend. Checked against their balance. */
  pointsToSpend?: number;
};
