"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NEXT_STATUS, type Order, type OrderStatus } from "@/lib/orders/types";
import ActionMenu, { type MenuAction } from "./ActionMenu";
import { formatPhone } from "@/lib/format/phone";

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

/** What the forward move is called, per current status. */
const ADVANCE_LABEL: Record<OrderStatus, string | null> = {
  received: "Start preparing",
  preparing: "Mark packed",
  packed: "Mark picked up",
  picked_up: null,
  cancelled: null,
};

/** Unpriced orders read the same everywhere: the dashboard says this too. */
function money(cents: number | null) {
  return cents === null ? "Priced at store" : `$${(cents / 100).toFixed(2)}`;
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrdersWorkspace({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const router = useRouter();

  async function move(order: Order, next: OrderStatus) {
    setBusy(order.id);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not update the order.");
        return;
      }
      setConfirming(null);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        // Only compare phones when the query actually has digits — otherwise
        // `includes("")` is true and every order matches.
        (/\d/.test(q) && o.customer.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""))) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [orders, query, status]);

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      <div className="crm-toolbar">
        <input
          type="search"
          placeholder="Search order, name, phone or item…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | OrderStatus)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <span className="portal-muted" style={{ fontSize: 13 }}>
          {filtered.length} of {orders.length}
        </span>
      </div>

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>When</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="crm-empty">
                    {orders.length === 0
                      ? "No orders yet. They appear here the moment a customer checks out."
                      : "Nothing matches that search."}
                  </td>
                </tr>
              )}

              {filtered.map((o) => {
                const advance = NEXT_STATUS[o.status];
                const advanceLabel = ADVANCE_LABEL[o.status];
                const closed = o.status === "picked_up" || o.status === "cancelled";

                return (
                  /* Row and its detail panel are one unit so the panel opens
                     under the row that was clicked, not at the foot of the table. */
                  <Fragment key={o.id}>
                    <tr>
                      <td>
                        <strong>{o.orderNumber}</strong>
                      </td>
                      <td>{when(o.createdAt)}</td>
                      <td>
                        {o.customer.name}
                        <span className="portal-muted d-block">{formatPhone(o.customer.phone)}</span>
                      </td>
                      <td>
                        {o.items.reduce((n, i) => n + i.qty, 0)} item
                        {o.items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"}
                      </td>
                      <td>
                        <span className={`portal-badge ${STATUS_BADGE[o.status]}`}>
                          {STATUS_LABEL[o.status]}
                        </span>
                      </td>
                      <td>{money(o.totalCents)}</td>
                      <td style={{ textAlign: "right" }}>
                        {confirming === o.id ? (
                          <div className="crm-actions crm-actions--confirm">
                            <span className="portal-muted" style={{ fontSize: 13 }}>
                              Cancel <strong>{o.orderNumber}</strong>?
                            </span>
                            <button
                              type="button"
                              className="portal-btn portal-btn-danger"
                              disabled={busy === o.id}
                              onClick={() => move(o, "cancelled")}
                            >
                              {busy === o.id ? "Cancelling…" : "Yes, cancel"}
                            </button>
                            <button
                              type="button"
                              className="portal-btn"
                              onClick={() => setConfirming(null)}
                            >
                              Keep
                            </button>
                          </div>
                        ) : (
                          <ActionMenu
                            label={`Actions for ${o.orderNumber}`}
                            actions={[
                              ...(advance && advanceLabel
                                ? ([
                                    {
                                      label: advanceLabel,
                                      disabled: busy === o.id,
                                      onSelect: () => move(o, advance),
                                    },
                                  ] as MenuAction[])
                                : []),
                              {
                                label: open === o.id ? "Hide details" : "View details",
                                onSelect: () => setOpen(open === o.id ? null : o.id),
                              },
                              ...(!closed
                                ? ([
                                    {
                                      label: "Cancel order",
                                      danger: true,
                                      disabled: busy === o.id,
                                      onSelect: () => setConfirming(o.id),
                                    },
                                  ] as MenuAction[])
                                : []),
                            ]}
                          />
                                                )}
                      </td>
                    </tr>

                    {open === o.id && (
                      <tr>
                        <td colSpan={7} style={{ background: "var(--p-bg)" }}>
                          <div className="crm-grid-2" style={{ padding: "4px 0" }}>
                            <div>
                              <h3 style={{ fontSize: 13, margin: "0 0 8px" }}>Items</h3>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {o.items.map((i) => (
                                  <li key={`${i.productSlug}-${i.size ?? ""}`} style={{ fontSize: 13 }}>
                                    {i.qty} × {i.name}{" "}
                                    <span className="portal-muted">
                                      ({i.priceCents === null
                                        ? "unpriced"
                                        : `$${(i.priceCents / 100).toFixed(2)}`}
                                      )
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              {o.notes && (
                                <p className="portal-note" style={{ marginTop: 10 }}>
                                  {o.notes}
                                </p>
                              )}
                            </div>
                            <div>
                              <h3 style={{ fontSize: 13, margin: "0 0 8px" }}>Timeline</h3>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {o.statusHistory.map((h, i) => (
                                  <li key={i} style={{ fontSize: 13 }}>
                                    {STATUS_LABEL[h.status]}{" "}
                                    <span className="portal-muted">at {when(h.at)}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="portal-muted" style={{ fontSize: 12, marginTop: 10 }}>
                                {o.paymentMethod === "pay_at_store" ? "Pay at store" : "Prepaid"} ·{" "}
                                {o.paymentStatus} · tracking token{" "}
                                <code>{o.trackingToken}</code>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
