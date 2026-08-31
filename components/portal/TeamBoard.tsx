"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders/types";

const COLUMNS: { key: OrderStatus; label: string; advanceLabel: string }[] = [
  { key: "received", label: "New", advanceLabel: "Start preparing" },
  { key: "preparing", label: "Preparing", advanceLabel: "Mark packed" },
  { key: "packed", label: "Packed", advanceLabel: "Mark picked up" },
];

const NEXT: Record<string, OrderStatus> = {
  received: "preparing",
  preparing: "packed",
  packed: "picked_up",
};

function timeAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} h ${mins % 60} min ago`;
}

export default function TeamBoard() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [prepMin, setPrepMin] = useState(20);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
      setError(null);
    } catch {
      setError("Could not load orders.");
    }
  }, []);

  // Polling stands in for the Firestore realtime listener CLAUDE.md calls for.
  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  async function advance(order: Order) {
    const next = NEXT[order.status];
    if (!next || busy) return;
    setBusy(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Could not update that order.");
        return;
      }
      await load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  const today = new Date().toDateString();
  const live = (orders ?? []).filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  );

  return (
    <>
      <div className="crm-toolbar">
        <button type="button" className="portal-btn" onClick={load}>
          Refresh now
        </button>
        <label className="crm-toolbar__label">
          Prep time
          <input
            type="number"
            min={5}
            max={120}
            value={prepMin}
            onChange={(e) => setPrepMin(Number(e.target.value) || 20)}
            aria-label="Default prep time in minutes"
          />
          min
        </label>
        <span className="portal-muted">
          {orders === null ? "Loading…" : `${live.length} order(s) today`}
        </span>
      </div>

      {error && <p className="portal-note">{error}</p>}

      <div className="team-board">
        {COLUMNS.map((col) => {
          const list = live.filter((o) => o.status === col.key);
          return (
            <section key={col.key} className="team-col">
              <div className="team-col-head">
                <span>{col.label}</span>
                <span className="portal-badge">{list.length}</span>
              </div>
              <div className="team-col-body">
                {list.length === 0 && <p className="portal-muted">Empty</p>}
                {list.map((o) => (
                  <article key={o.id} className="team-order">
                    <strong>{o.orderNumber}</strong>
                    <div className="portal-muted">
                      {o.customer.name} · {o.customer.phone}
                    </div>
                    <div className="portal-muted">
                      {o.paymentMethod === "pay_at_store" ? "Pay at store" : "Prepaid"} ·{" "}
                      {timeAgo(o.createdAt)}
                    </div>
                    <ul>
                      {o.items.map((it) => (
                        <li key={it.productSlug}>
                          {it.qty} × {it.name}
                        </li>
                      ))}
                    </ul>
                    {o.notes && (
                      <p className="portal-note" style={{ marginTop: 8 }}>
                        {o.notes}
                      </p>
                    )}
                    <button
                      type="button"
                      className="portal-btn portal-btn-primary"
                      disabled={busy === o.id}
                      onClick={() => advance(o)}
                    >
                      {busy === o.id ? "Saving…" : col.advanceLabel}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="crm-card">
        <div className="crm-card__head">
          <div>
            <h2>Sold-out toggles</h2>
            <p>
              Wire to <code>products.available</code> when Firestore is live.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
