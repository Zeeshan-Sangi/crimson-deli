import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import { listProducts } from "@/lib/products/store";
import {
  ICE_CREAM_SIZES,
  type IceCreamSize,
  iceCreamPriceCents,
  isIceCreamItem,
} from "@/lib/data/food-menu";
import { getSettings, storeOpenState } from "@/lib/settings/store";
import { computeOrderTotals } from "@/lib/settings/tax";
import {
  NEXT_STATUS,
  type CreateOrderInput,
  type Order,
  type OrderStatus,
} from "./types";

/**
 * Order store.
 *
 * Backed by a JSON file for now so orders survive a dev-server restart and show
 * up in the team and admin portals without a database. Everything the app uses
 * goes through the functions below, so swapping in Firestore later means
 * rewriting only this file.
 *
 * NOTE: a JSON file does not persist on serverless hosting (Vercel gives each
 * invocation a fresh, read-only filesystem). This is fine for local work; real
 * deployment needs the Firestore implementation from CLAUDE.md §3.
 */
/**
 * Orders live in Firestore, one document per order keyed by its id.
 *
 * The seed script left a `_placeholder` document in each collection; those are
 * filtered out on read rather than deleted, so re-seeding stays harmless.
 */
const COLLECTION = "orders";
const COUNTER_DOC = "orderCounter";

function col() {
  return getAdminDb().collection(COLLECTION);
}

function isPlaceholder(data: FirebaseFirestore.DocumentData): boolean {
  return data._seed === true;
}

function toOrder(doc: FirebaseFirestore.QueryDocumentSnapshot): Order | null {
  const data = doc.data();
  if (isPlaceholder(data)) return null;
  return data as Order;
}

function token(): string {
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

export class OrderValidationError extends Error {}

/**
 * Creates an order from client input.
 *
 * Item names and prices are re-resolved from the menu on the server — the
 * client only gets to say *which* product and *how many*, never what it costs
 * (CLAUDE.md: never trust client-computed totals).
 */
export async function createOrder(
  input: CreateOrderInput,
  /** Signed-in customer, when there is one. Guests pass null. */
  uid: string | null = null,
): Promise<Order> {
  // The ordering window is enforced here, not just in the UI.
  const settings = await getSettings();
  const openState = storeOpenState(settings);
  if (!openState.open) {
    throw new OrderValidationError(
      openState.reason === "paused"
        ? "The store has paused online orders. Please call instead."
        : `The store is closed right now.${openState.nextOpen ? ` We reopen ${openState.nextOpen}.` : ""}`,
    );
  }

  const name = input.customer?.name?.trim() ?? "";
  const phone = input.customer?.phone?.trim() ?? "";
  const email = input.customer?.email?.trim() || null;

  if (!name) throw new OrderValidationError("A name is required.");
  if (phone.replace(/\D/g, "").length < 10)
    throw new OrderValidationError("A reachable phone number is required.");
  if (!Array.isArray(input.items) || input.items.length === 0)
    throw new OrderValidationError("The order has no items.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new OrderValidationError("That email address is not valid.");

  const menu = await listProducts();
  const items = input.items.map((line) => {
    const product = menu.find((f) => f.slug === line.productSlug);
    if (!product) throw new OrderValidationError(`Unknown item: ${line.productSlug}`);
    // Hidden means off the menu: it is not listed anywhere, so an order naming
    // it came from a stale cart or a hand-made request either way.
    if (product.hidden)
      throw new OrderValidationError(`${product.name} is not on the menu right now.`);
    if (!product.available)
      throw new OrderValidationError(`${product.name} is sold out.`);
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 99)
      throw new OrderValidationError(`Invalid quantity for ${product.name}.`);

    let priceCents = product.priceCents;
    let name = product.name;
    let size: IceCreamSize | undefined;

    if (isIceCreamItem(product)) {
      size = line.size === "large" ? "large" : "small";
      priceCents = iceCreamPriceCents(size);
      name = `${product.name} (${ICE_CREAM_SIZES[size].label})`;
    } else if (line.size) {
      throw new OrderValidationError(`Size is not valid for ${product.name}.`);
    }

    return {
      productSlug: product.slug,
      name,
      priceCents,
      qty,
      size,
    };
  });

  // A total is only meaningful once every line has a real price.
  const anyUnpriced = items.some((i) => i.priceCents === null);
  const subtotalCents = anyUnpriced
    ? null
    : items.reduce((sum, i) => sum + (i.priceCents ?? 0) * i.qty, 0);

  const { taxCents, totalCents } = computeOrderTotals(subtotalCents, settings.checkout);

  const db = getAdminDb();
  const now = new Date().toISOString();

  // The order number comes from a counter document bumped inside a
  // transaction. The old `2481 + orders.length` reused a number as soon as any
  // order was deleted, and raced under concurrent checkouts.
  const seq = await db.runTransaction(async (tx) => {
    const ref = db.collection("meta").doc(COUNTER_DOC);
    const snap = await tx.get(ref);
    const next = snap.exists ? (snap.data()!.next as number) : 2482;
    tx.set(ref, { next: next + 1, updatedAt: now }, { merge: true });
    return next;
  });

  {
    const order: Order = {
      id: randomUUID(),
      orderNumber: `CD-${seq}`,
      status: "received",
      items,
      subtotalCents,
      taxCents,
      totalCents,
      paymentMethod: "pay_at_store",
      paymentStatus: "unpaid",
      customer: { name, phone, email, uid },
      isGuest: uid === null,
      notes: input.notes?.trim() || null,
      trackingToken: token(),
      statusHistory: [{ status: "received", at: now, byUid: null }],
      createdAt: now,
      updatedAt: now,
    };

    await col().doc(order.id).set(order);
    return order;
  }
}

/** One customer's own orders, newest first — their account page. */
export async function ordersForUser(uid: string): Promise<Order[]> {
  // Sorted in memory so this needs no composite index — one customer's order
  // count stays small.
  const snap = await col().where("customer.uid", "==", uid).get();
  return snap.docs
    .map(toOrder)
    .filter((o): o is Order => o !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listOrders(): Promise<Order[]> {
  const snap = await col().orderBy("createdAt", "desc").get();
  return snap.docs.map(toOrder).filter((o): o is Order => o !== null);
}

export async function getOrderByToken(trackingToken: string): Promise<Order | null> {
  const snap = await col().where("trackingToken", "==", trackingToken).limit(1).get();
  return snap.empty ? null : toOrder(snap.docs[0]);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const snap = await col().where("orderNumber", "==", orderNumber).limit(1).get();
  return snap.empty ? null : toOrder(snap.docs[0]);
}

/** Advances one step along the lifecycle, or cancels. Rejects illegal jumps. */
export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const db = getAdminDb();
  // A transaction, because this is a read-check-write: two staff advancing the
  // same order at once must not both pass the legality check.
  return db.runTransaction(async (tx) => {
    const ref = col().doc(id);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new OrderValidationError("Order not found.");

    const current = snap.data() as Order;
    const allowed = status === "cancelled" || NEXT_STATUS[current.status] === status;
    if (!allowed)
      throw new OrderValidationError(
        `Cannot move an order from ${current.status} to ${status}.`,
      );

    const now = new Date().toISOString();
    const updated: Order = {
      ...current,
      status,
      updatedAt: now,
      statusHistory: [...current.statusHistory, { status, at: now, byUid: null }],
    };
    tx.set(ref, updated);
    return updated;
  });
}

