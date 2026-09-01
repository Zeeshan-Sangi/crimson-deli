"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatCents, useCart } from "@/lib/cart/CartContext";
import { PRICE_PLACEHOLDER } from "@/lib/data/food-menu";
import { siteConfig } from "@/lib/site-config";
import { X } from "lucide-react";

type MenuPrices = Record<string, { name: string; priceCents: number | null }>;

export default function CartView({
  signedIn = false,
  menu,
}: {
  signedIn?: boolean;
  menu?: MenuPrices;
}) {
  const { lines, count, subtotalCents, ready, setQty, remove, clear , syncPrices } = useCart();

  // Runs again once `ready` flips: the provider loads the stored cart in its
  // own effect, so on first pass there is nothing here to correct yet.
  useEffect(() => {
    if (ready && menu) syncPrices(menu);
  }, [ready, menu, syncPrices]);

  if (!ready) {
    return <p className="cd-product__meta">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="cd-empty">
        <h2>Your cart is empty</h2>
        <p>
          Fresh food is made at the counter and collected in-store. Add something from the
          menu to get started.
        </p>
        <Link href="/food" className="cd-btn-solid">
          Browse fresh food
        </Link>
      </div>
    );
  }

  return (
    <div className="cd-cart-layout">
      <div className="cd-cart-main">
        <div className="cd-cart-table-wrap">
          <table className="cd-cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.lineKey}>
                  <td>
                    <div className="cd-cart-item">
                      <img src={line.imageUrl} alt="" width={64} height={64} />
                      <Link href={`/food/${line.slug}`}>{line.name}</Link>
                    </div>
                  </td>
                  <td>
                    {line.priceCents === null
                      ? PRICE_PLACEHOLDER
                      : formatCents(line.priceCents)}
                  </td>
                  <td>
                    <div className="cd-qty-row" style={{ marginBottom: 0 }}>
                      <button
                        type="button"
                        className="cd-qty-btn"
                        aria-label={`Decrease ${line.name}`}
                        onClick={() => setQty(line.lineKey, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="cd-qty-value">{line.qty}</span>
                      <button
                        type="button"
                        className="cd-qty-btn"
                        aria-label={`Increase ${line.name}`}
                        onClick={() => setQty(line.lineKey, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {line.priceCents === null
                      ? "N/A"
                      : formatCents(line.priceCents * line.qty)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cd-qty-btn"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => remove(line.lineKey)}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cd-cart-foot">
            <Link href="/food">← Back to menu</Link>
            <button type="button" onClick={clear} className="cd-btn-solid cd-btn-solid--ghost">
              Clear cart
            </button>
          </div>
        </div>
      </div>

      <div className="cd-cart-aside">
        <div className="cd-summary">
          <h3>Pickup order</h3>
          <p>
            Fresh food only. Pick up at <strong>{siteConfig.street}</strong>. No delivery
            on this cart. Everyday essentials order on <Link href="/store">DoorDash</Link>.
          </p>
        </div>

        <div className="cd-summary">
          <h3>Order summary</h3>
          <div className="cd-summary-row">
            <span>Items</span>
            <span>{count}</span>
          </div>
          <div className="cd-summary-row cd-summary-row--total">
            <span>Subtotal</span>
            <span>
              {subtotalCents === null ? "Confirmed at store" : formatCents(subtotalCents)}
            </span>
          </div>
          {subtotalCents === null && (
            <p className="cd-product__fine">
              Menu prices have not been finalised yet, so the total is confirmed by the
              store when you collect.
            </p>
          )}
          <Link
            href={signedIn ? "/checkout" : "/login?next=%2Fcheckout"}
            className="cd-btn-solid"
          >
            {signedIn ? "Checkout for pickup" : "Sign in to check out"}
          </Link>
        </div>
      </div>
    </div>
  );
}
