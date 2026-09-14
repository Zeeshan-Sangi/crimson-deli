import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import { listProducts } from "@/lib/products/store";
import {
  ICE_CREAM_SIZES,
  type IceCreamSize,
  cleanMods,
  flavorGroupsFor,
  flavorSuffix,
  hasMods,
  iceCreamPriceCents,
  ingredientsFor,
  isIceCreamItem,
  modsPriceCents,
  modsSuffix,
} from "@/lib/data/food-menu";
import { getSettings, storeOpenState } from "@/lib/settings/store";
import { pointsForSpend, pointsToCents } from "@/lib/settings/types";
import { computeOrderTotals } from "@/lib/settings/tax";
import { movePointsInTransaction } from "@/lib/rewards/store";
import { userRef } from "@/lib/auth/store";
import type { User } from "@/lib/auth/types";
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
 * deployment needs the Firestore implementation the brief calls for.
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
 * (project rule: never trust client-computed totals).
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

    // The picker on the product page is the polite version of this check; this
    // is the one that decides what the kitchen is told to make.
    const groups = flavorGroupsFor(product);
    let flavors: Record<string, string | string[]> | undefined;

    if (groups.length > 0) {
      const chosen: Record<string, string | string[]> = {};
      for (const group of groups) {
        const raw = line.flavors?.[group.key];
        const picked = Array.isArray(raw)
          ? raw.filter((v): v is string => typeof v === "string")
          : typeof raw === "string"
            ? [raw]
            : [];
        const valid = [...new Set(picked)].filter((v) => group.options.includes(v));
        if (valid.length === 0) {
          throw new OrderValidationError(
            `Choose a ${group.label.toLowerCase()} for ${product.name}.`,
          );
        }
        if (!group.multi && valid.length > 1) {
          throw new OrderValidationError(
            `Choose one ${group.label.toLowerCase()} for ${product.name}.`,
          );
        }
        chosen[group.key] = group.multi ? valid : valid[0]!;
      }
      flavors = chosen;
      name = `${name}${flavorSuffix(product.slug, chosen)}`;
    } else if (line.flavors && Object.keys(line.flavors).length > 0) {
      throw new OrderValidationError(`Flavors are not valid for ${product.name}.`);
    }

    // Ingredient changes are re-read from the product, never trusted from the
    // cart: an extra's price is decided here, and one the store has since
    // dropped must not reach the kitchen.
    const askedForMods =
      (line.mods?.removed?.length ?? 0) > 0 || (line.mods?.added?.length ?? 0) > 0;
    if (askedForMods && ingredientsFor(product).length === 0)
      throw new OrderValidationError(`${product.name} cannot be customised.`);

    const cleanedMods = cleanMods(product, line.mods);
    const mods = hasMods(cleanedMods) ? cleanedMods : undefined;

    if (mods) {
      if (priceCents !== null) priceCents += modsPriceCents(product, mods);
      name = `${name}${modsSuffix(product, mods)}`;
    }

    return {
      productSlug: product.slug,
      name,
      priceCents,
      qty,
      size,
      flavors,
      mods,
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

  const draft = (extra: {
    discountCents?: number;
    pointsSpent?: number;
    totalCents: number | null;
  }): Order => ({
    id: randomUUID(),
    orderNumber: `CD-${seq}`,
    status: "received",
    items,
    subtotalCents,
    taxCents,
    discountCents: extra.discountCents,
    pointsSpent: extra.pointsSpent,
    totalCents: extra.totalCents,
    paymentMethod: "pay_at_store",
    paymentStatus: "unpaid",
    customer: { name, phone, email, uid },
    isGuest: uid === null,
    notes: input.notes?.trim() || null,
    trackingToken: token(),
    statusHistory: [{ status: "received", at: now, byUid: null }],
    createdAt: now,
    updatedAt: now,
  });

  const asked = Math.max(0, Math.floor(Number(input.pointsToSpend ?? 0)));
  const canRedeem =
    asked > 0 && uid !== null && settings.rewards.enabled && totalCents !== null;

  if (!canRedeem) {
    if (asked > 0)
      throw new OrderValidationError("Points cannot be used on this order.");
    const order = draft({ totalCents });
    await col().doc(order.id).set(order);
    return order;
  }

  // The balance is read and spent in one transaction with the order write, so
  // two checkouts at once cannot both spend the same points, and an order that
  // fails to save never takes them.
  return db.runTransaction(async (tx) => {
    const userDoc = await tx.get(userRef(uid!));
    const balance = Math.max(0, Math.floor((userDoc.data() as User | undefined)?.points ?? 0));

    if (balance < asked || asked < settings.rewards.minRedeemPoints)
      throw new OrderValidationError("You do not have enough points for that.");

    // Whole dollars only, on both sides: points never buy a part-dollar, and
    // never more whole dollars than the order is worth. The remainder stays in
    // the balance. Checkout offers exactly this, so the customer is charged
    // what the page showed.
    const capped = Math.min(
      pointsToCents(asked, settings.rewards),
      Math.floor(totalCents! / 100) * 100,
    );
    const discountCents = Math.max(0, capped);
    const pointsSpent =
      (discountCents / 100) * settings.rewards.pointsPerDollarOff;

    const order = draft({
      discountCents,
      pointsSpent,
      totalCents: Math.max(0, totalCents! - discountCents),
    });

    if (pointsSpent > 0) {
      movePointsInTransaction(tx, {
        uid: uid!,
        currentPoints: balance,
        delta: -pointsSpent,
        reason: "redeemed",
        orderId: order.id,
        orderNumber: order.orderNumber,
        at: now,
      });
    }
    tx.set(col().doc(order.id), order);
    return order;
  });
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
  const settings = await getSettings();

  // A transaction, because this is a read-check-write: two staff advancing the
  // same order at once must not both pass the legality check — and with points
  // riding on it, must not both award them.
  return db.runTransaction(async (tx) => {
    const ref = col().doc(id);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new OrderValidationError("Order not found.");

    const current = snap.data() as Order;
    // Only an open order can be cancelled. Picked up and cancelled are final —
    // the staff screen already offers no cancel for them — and holding that
    // here is what stops a second cancel from returning the same points twice.
    const isOpen = NEXT_STATUS[current.status] !== null;
    const allowed =
      status === "cancelled" ? isOpen : NEXT_STATUS[current.status] === status;
    if (!allowed)
      throw new OrderValidationError(
        `Cannot move an order from ${current.status} to ${status}.`,
      );

    // Points are earned on collection, not on ordering: an order that is
    // cancelled before pickup was never worth anything. `pointsEarned` on the
    // order is what stops a second award if it is advanced again.
    const uid = current.customer.uid;
    const earns =
      status === "picked_up" &&
      uid !== null &&
      current.pointsEarned === undefined &&
      current.totalCents !== null;

    const earned = earns ? pointsForSpend(current.totalCents!, settings.rewards) : 0;

    // Points spent on an order the store cancels go back: the customer never
    // got what they paid for with them.
    const refunded =
      status === "cancelled" && uid !== null ? Math.max(0, current.pointsSpent ?? 0) : 0;

    const pointsDelta = earned > 0 ? earned : refunded;
    const userDoc = pointsDelta > 0 ? await tx.get(userRef(uid!)) : null;

    const now = new Date().toISOString();
    const updated: Order = {
      ...current,
      status,
      pointsEarned: earns ? earned : current.pointsEarned,
      updatedAt: now,
      statusHistory: [...current.statusHistory, { status, at: now, byUid: null }],
    };
    tx.set(ref, updated);

    if (userDoc) {
      movePointsInTransaction(tx, {
        uid: uid!,
        currentPoints: Math.max(0, Math.floor((userDoc.data() as User | undefined)?.points ?? 0)),
        delta: pointsDelta,
        reason: earned > 0 ? "earned" : "refunded",
        orderId: current.id,
        orderNumber: current.orderNumber,
        at: now,
      });
    }
    return updated;
  });
}

