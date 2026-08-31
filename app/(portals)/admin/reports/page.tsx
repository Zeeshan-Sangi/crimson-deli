import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listOrders } from "@/lib/orders/store";
import { listProducts } from "@/lib/products/store";
import { listAudit } from "@/lib/audit/log";
import type { Order } from "@/lib/orders/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Reports · Admin" };

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Last 14 days of order counts, oldest first. */
function byDay(orders: Order[]) {
  const map = new Map<string, { count: number; cents: number }>();
  for (const o of orders) {
    const key = dayKey(o.createdAt);
    const cur = map.get(key) ?? { count: 0, cents: 0 };
    cur.count += 1;
    if (o.status === "picked_up" && o.totalCents !== null) cur.cents += o.totalCents;
    map.set(key, cur);
  }
  return [...map.entries()].slice(0, 14).reverse();
}

export default async function AdminReportsPage() {
  const user = (await getCurrentUser())!;
  const orders = await listOrders();
  const products = await listProducts();
  const audit = await listAudit(12);

  const collected = orders.filter((o) => o.status === "picked_up");
  const cancelled = orders.filter((o) => o.status === "cancelled");
  const revenue = collected.reduce((n, o) => n + (o.totalCents ?? 0), 0);
  const unpriced = products.filter((p) => p.priceCents === null).length;

  const itemCounts = new Map<string, number>();
  for (const o of orders) {
    for (const i of o.items) itemCounts.set(i.name, (itemCounts.get(i.name) ?? 0) + i.qty);
  }
  const top = [...itemCounts.entries()].sort((a, b) => b[1] - a[1]);
  const days = byDay(orders);
  const busiest = Math.max(1, ...days.map(([, d]) => d.count));

  return (
    <PortalShell
      user={user}
      title="Reports"
      subtitle="Everything measured from real orders. No projections."
    >
      <div className="crm-stats">
        <div className="crm-stat">
          <div className="crm-stat__label">Orders collected</div>
          <div className="crm-stat__value">{collected.length}</div>
          <div className="crm-stat__hint">of {orders.length} placed</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Revenue recorded</div>
          <div className="crm-stat__value">{money(revenue)}</div>
          <div className="crm-stat__hint">
            {unpriced > 0
              ? `From collected orders. ${unpriced} items unpriced, so the real total is higher`
              : "From collected orders only"}
          </div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Cancelled</div>
          <div className="crm-stat__value">{cancelled.length}</div>
          <div className="crm-stat__hint">
            {orders.length ? `${Math.round((cancelled.length / orders.length) * 100)}% of orders` : "N/A"}
          </div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Items per order</div>
          <div className="crm-stat__value">
            {orders.length
              ? (orders.reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0) / orders.length).toFixed(1)
              : "N/A"}
          </div>
          <div className="crm-stat__hint">Average</div>
        </div>
      </div>

      {unpriced > 0 && (
        <div className="portal-note" style={{ marginTop: 0 }}>
          Revenue only counts lines that have a price. {unpriced} fresh food item
          {unpriced === 1 ? "" : "s"} still have none, so these figures understate the real
          takings until prices are entered.
        </div>
      )}

      <div className="crm-grid-2">
        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Orders by day</h2>
              <p>Most recent 14 days with activity</p>
            </div>
          </div>
          {days.length === 0 ? (
            <p className="crm-empty">No orders yet.</p>
          ) : (
            <table className="portal-table">
              <tbody>
                {days.map(([day, d]) => (
                  <tr key={day}>
                    <td style={{ width: 130 }}>{day}</td>
                    <td>
                      <div
                        style={{
                          height: 8,
                          borderRadius: 4,
                          background: "var(--p-primary)",
                          width: `${(d.count / busiest) * 100}%`,
                          minWidth: 6,
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, width: 50 }}>{d.count}</td>
                    <td style={{ textAlign: "right", width: 80 }}>
                      {d.cents > 0 ? money(d.cents) : money(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Items sold</h2>
              <p>All time, by quantity</p>
            </div>
          </div>
          {top.length === 0 ? (
            <p className="crm-empty">Nothing sold yet.</p>
          ) : (
            <table className="portal-table">
              <tbody>
                {top.map(([name, qty]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="crm-card">
        <div className="crm-card__head">
          <div>
            <h2>Recent admin activity</h2>
            <p>Who changed what</p>
          </div>
        </div>
        {audit.length === 0 ? (
          <p className="crm-empty">No admin changes recorded yet.</p>
        ) : (
          <div className="crm-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Action</th>
                  <th>Item</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((e) => (
                  <tr key={e.id}>
                    <td>
                      {new Date(e.at).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td><code>{e.action}</code></td>
                    <td>{e.entity.label ?? e.entity.id}</td>
                    <td>{e.actor.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PortalShell>
  );
}
