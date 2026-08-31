import type { Metadata } from "next";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listOrders } from "@/lib/orders/store";
import { foodItems } from "@/lib/data/food-menu";
import { getCatalog } from "@/lib/data/convenience";
import type { Order, OrderStatus } from "@/lib/orders/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard · Admin" };

const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Received",
  preparing: "Preparing",
  packed: "Packed",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  received: "portal-badge-new",
  preparing: "portal-badge-preparing",
  packed: "portal-badge-packed",
  picked_up: "portal-badge-done",
  cancelled: "portal-badge-done",
};

function money(cents: number | null) {
  return cents === null ? "N/A" : `$${(cents / 100).toFixed(2)}`;
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function topItems(orders: Order[]) {
  const counts = new Map<string, number>();
  for (const o of orders) {
    for (const item of o.items) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + item.qty);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export default async function AdminDashboard() {
  const user = (await getCurrentUser())!;
  const orders = await listOrders();
  const catalog = await getCatalog();

  const today = orders.filter((o) => isToday(o.createdAt));
  const open = orders.filter((o) =>
    ["received", "preparing", "packed"].includes(o.status),
  );
  const unpriced = foodItems.filter((f) => f.priceCents === null).length;

  const revenueKnown = orders
    .filter((o) => o.status === "picked_up" && o.totalCents !== null)
    .reduce((sum, o) => sum + (o.totalCents ?? 0), 0);

  return (
    <PortalShell
      user={user}
      title={`Good to see you, ${user.name.split(" ")[0]}`}
      subtitle="Everything happening at Ogontz Avenue right now."
    >
      <div className="crm-stats">
        <div className="crm-stat">
          <div className="crm-stat__label">Open orders</div>
          <div className="crm-stat__value">{open.length}</div>
          <div className="crm-stat__hint">Not yet collected</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Orders today</div>
          <div className="crm-stat__value">{today.length}</div>
          <div className="crm-stat__hint">Since midnight</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">All orders</div>
          <div className="crm-stat__value">{orders.length}</div>
          <div className="crm-stat__hint">Lifetime</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Collected revenue</div>
          <div className="crm-stat__value">
            {orders.length === 0 ? "N/A" : money(revenueKnown)}
          </div>
          <div className="crm-stat__hint">
            {unpriced > 0 ? `${unpriced} items still unpriced` : "All items priced"}
          </div>
        </div>
      </div>

      {unpriced > 0 && (
        <div className="portal-note" style={{ marginTop: 0, marginBottom: 16 }}>
          <strong>{unpriced} of {foodItems.length} fresh food items have no price yet.</strong>{" "}
          Totals stay blank and customers pay at the counter until the store supplies
          them. Add them in <Link href="/admin/products">Products</Link>.
        </div>
      )}

      <div className="crm-grid-2">
        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Latest orders</h2>
              <p>Newest first</p>
            </div>
            <Link href="/admin/orders" className="portal-btn">
              All orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="crm-empty">
              No orders yet. They appear here the moment a customer checks out.
            </p>
          ) : (
            <div className="crm-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.orderNumber}</strong>
                      </td>
                      <td>{o.customer.name}</td>
                      <td>
                        <span className={`portal-badge ${STATUS_BADGE[o.status]}`}>
                          {STATUS_LABEL[o.status]}
                        </span>
                      </td>
                      <td>{money(o.totalCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Most ordered</h2>
              <p>By quantity, all time</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="crm-empty">Nothing ordered yet.</p>
          ) : (
            <table className="portal-table">
              <tbody>
                {topItems(orders).map(([name, qty]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="crm-card__head" style={{ marginTop: 20, marginBottom: 8 }}>
            <div>
              <h2>Catalog</h2>
              <p>What is on the site</p>
            </div>
          </div>
          <table className="portal-table">
            <tbody>
              <tr>
                <td>Fresh food items</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{foodItems.length}</td>
              </tr>
              <tr>
                <td>Convenience products</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{catalog.count}</td>
              </tr>
              <tr>
                <td>Sold out</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>
                  {foodItems.filter((f) => !f.available).length}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </PortalShell>
  );
}
