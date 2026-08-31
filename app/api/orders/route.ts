import { NextResponse } from "next/server";
import {
  OrderValidationError,
  createOrder,
  listOrders,
} from "@/lib/orders/store";
import type { CreateOrderInput } from "@/lib/orders/types";
import { requireRole } from "@/lib/auth/current-user";

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
    const order = await createOrder(body);
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
