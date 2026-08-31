import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { listProducts } from "@/lib/products/store";
import {
  ICE_CREAM_SIZES,
  type IceCreamSize,
  iceCreamPriceCents,
  isIceCreamItem,
} from "@/lib/data/food-menu";
import { getSettings, storeOpenState } from "@/lib/settings/store";
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
const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Serialise writes so two concurrent checkouts cannot clobber each other.
let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Order[]> {
  try {
    const raw = await readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
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
export async function createOrder(input: CreateOrderInput): Promise<Order> {
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

  return serialise(async () => {
    const orders = await readAll();
    const seq = 2481 + orders.length; // continues the store's existing numbering
    const now = new Date().toISOString();

    const order: Order = {
      id: randomUUID(),
      orderNumber: `CD-${seq}`,
      status: "received",
      items,
      subtotalCents,
      totalCents: subtotalCents,
      paymentMethod: "pay_at_store",
      paymentStatus: "unpaid",
      customer: { name, phone, email, uid: null },
      isGuest: true,
      notes: input.notes?.trim() || null,
      trackingToken: token(),
      statusHistory: [{ status: "received", at: now, byUid: null }],
      createdAt: now,
      updatedAt: now,
    };

    await writeAll([order, ...orders]);
    return order;
  });
}

export async function listOrders(): Promise<Order[]> {
  const orders = await readAll();
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderByToken(trackingToken: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.trackingToken === trackingToken) ?? null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.orderNumber === orderNumber) ?? null;
}

/** Advances one step along the lifecycle, or cancels. Rejects illegal jumps. */
export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return serialise(async () => {
    const orders = await readAll();
    const i = orders.findIndex((o) => o.id === id);
    if (i === -1) throw new OrderValidationError("Order not found.");

    const current = orders[i];
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
    orders[i] = updated;
    await writeAll(orders);
    return updated;
  });
}
