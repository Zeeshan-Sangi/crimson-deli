import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import OrdersWorkspace from "@/components/portal/OrdersWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listOrders } from "@/lib/orders/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orders · Admin" };

export default async function AdminOrdersPage() {
  const user = (await getCurrentUser())!;
  const orders = await listOrders();

  return (
    <PortalShell
      user={user}
      title="Orders"
      subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}, newest first`}
    >
      <OrdersWorkspace orders={orders} />
    </PortalShell>
  );
}
