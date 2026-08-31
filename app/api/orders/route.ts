import { NextResponse } from "next/server";
import {
  OrderValidationError,
  createOrder,
  listOrders,
} from "@/lib/orders/store";
import type { CreateOrderInput } from "@/lib/orders/types";
import { getCurrentUser, requireRole } from "@/lib/auth/current-user";

// Orders are read and written per request; nothing here may be cached.
export const dynamic = "force-dynamic";

/**
 * Staff/admin order list.
 *
 * Guarded: the payload carries customer names, phone numbers and each order's
 * tracking token — the token alone grants access to /order/[token] — so this
 * must never answer an unauthenticated request.
 */
export async function GET() {
  try {
    await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

/** Places a pickup order. Prices and totals are recomputed server-side. */
export async function POST(request: Request) {
  let body: CreateOrderInput;
  try {
    body = (await request.json()) as CreateOrderInput;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  try {
    // Ordering requires an account: the store wants every order tied to a
    // customer, not left as an anonymous guest ticket.
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to place an order." },
        { status: 401 },
      );
    }
    const order = await createOrder(body, user.id);
    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        status: order.status,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[orders] create failed", err);
    return NextResponse.json({ error: "Could not save the order." }, { status: 500 });
  }
}
