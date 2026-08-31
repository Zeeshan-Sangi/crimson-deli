import { NextResponse } from "next/server";
import { OrderValidationError, setOrderStatus } from "@/lib/orders/store";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/types";
import { requireRole } from "@/lib/auth/current-user";
import { writeAudit } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/** Staff move an order along the lifecycle. Illegal jumps are rejected. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Without this any caller could advance or cancel any order.
  let actor;
  try {
    actor = await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;

  let status: OrderStatus;
  try {
    const body = (await request.json()) as { status?: string };
    if (!body.status || !ORDER_STATUSES.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    status = body.status as OrderStatus;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  try {
    const order = await setOrderStatus(id, status);
    await writeAudit({
      action: "order.status",
      entity: { type: "order", id: order.id, label: order.orderNumber },
      actor,
      note: status,
    });
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[orders] status update failed", err);
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}
