import { NextResponse, after } from "next/server";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "@/lib/auth/mailer";
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

    const customerEmail =
      body.customer?.email?.trim() || user.email?.trim() || "";

    // `after` rather than a bare `void`: on serverless the function can be torn
    // down the moment the response is returned, so a detached promise may never
    // run. This still keeps mail off the critical path — the order is saved and
    // answered first, and a mail failure never fails the order.
    after(async () => {
      try {
        await sendOrderNotificationEmail(order);
      } catch (err) {
        console.error("[orders] notification email failed", err);
      }

      if (customerEmail) {
        try {
          await sendOrderConfirmationEmail(order, customerEmail);
        } catch (err) {
          console.error("[orders] customer confirmation email failed", err);
        }
      }
    });

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
