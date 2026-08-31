/** Order lifecycle from CLAUDE.md §5. No delivery stage — fresh food is pickup only. */
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
};

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
  items: { productSlug: string; qty: number; size?: "small" | "large" }[];
  customer: { name: string; phone: string; email?: string };
  notes?: string;
};
