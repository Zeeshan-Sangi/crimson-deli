"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCents, useCart } from "@/lib/cart/CartContext";
import { PRICE_PLACEHOLDER } from "@/lib/data/food-menu";
import { formatPhone } from "@/lib/format/phone";
import { siteConfig } from "@/lib/site-config";

type Details = { name: string; phone: string; email: string; notes: string };
const EMPTY: Details = { name: "", phone: "", email: "", notes: "" };

export default function CheckoutView({
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
}) {
  const { lines, count, subtotalCents, ready, clear } = useCart();
  // Prefilled from the signed-in account — ordering requires one, so these are
  // details the store already holds.
  const [details, setDetails] = useState<Details>({
    ...EMPTY,
    name: defaultName,
    phone: defaultPhone,
    email: defaultEmail,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [placed, setPlaced] = useState<{ orderNumber: string; trackingToken: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set =
    (key: keyof Details) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDetails((d) => ({ ...d, [key]: e.target.value }));
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    };

  function validate() {
    const next: Partial<Record<keyof Details, string>> = {};
    if (!details.name.trim()) next.name = "We need a name for the order.";
    if (details.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a phone number we can reach you on.";
    if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      next.email = "That email address does not look right.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productSlug: l.slug,
            qty: l.qty,
            size: l.size,
          })),
          customer: {
            name: details.name.trim(),
            phone: details.phone.trim(),
            email: details.email.trim() || undefined,
          },
          notes: details.notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // A session can expire between loading the page and submitting; send
        // them to sign in and straight back, rather than showing a dead end.
        if (res.status === 401) {
          window.location.href = "/login?next=%2Fcheckout";
          return;
        }
        setSubmitError(data?.error ?? "Could not place the order. Please try again.");
        return;
      }

      setPlaced({ orderNumber: data.orderNumber, trackingToken: data.trackingToken });
      clear();
    } catch {
      setSubmitError("Could not reach the store. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return <p className="cd-product__meta">Loading your order…</p>;

  if (lines.length === 0 && !placed) {
    return (
      <div className="cd-empty">
        <h2>Nothing to check out</h2>
        <p>Add something from the fresh food menu first.</p>
        <Link href="/food" className="cd-btn-solid">
          Browse fresh food
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="cd-empty">
        <h2>Order placed</h2>
        <p>
          Your order reference is <strong>{placed.orderNumber}</strong>. The counter has it
          now and will call you on {formatPhone(details.phone)} when it is ready to collect.
        </p>
        <p>
          Collect from {siteConfig.address}. Questions? Call{" "}
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
        </p>
        <div className="cd-hero__actions">
          <Link href={`/order/${placed.trackingToken}`} className="cd-btn-solid">
            Track this order
          </Link>
          <button
            type="button"
            onClick={() => {
              setPlaced(null);
              setDetails(EMPTY);
            }}
            className="cd-btn-solid cd-btn-solid--ghost"
          >
            Start a new order
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="cd-form" onSubmit={handleSubmit} noValidate>
      <div className="cd-checkout-layout">
        <div>
          <h2>Pickup details</h2>
          <p>
            Fresh food is collected in-store at {siteConfig.address}. We do not deliver
            fresh food, so there is no address to fill in.
          </p>

          <div className="cd-form-grid cd-form-grid--2">
            <div className="cd-form-field">
              <label htmlFor="co-name">Your name</label>
              <input
                id="co-name"
                type="text"
                placeholder="Your name"
                value={details.name}
                onChange={set("name")}
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="cd-form-error">{errors.name}</p>}
            </div>

            <div className="cd-form-field">
              <label htmlFor="co-phone">Phone number</label>
              <input
                id="co-phone"
                type="tel"
                placeholder="Phone number"
                value={details.phone}
                onChange={set("phone")}
                autoComplete="tel"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="cd-form-error">{errors.phone}</p>}
            </div>

            <div className="cd-form-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="co-email">Email (optional)</label>
              <input
                id="co-email"
                type="email"
                placeholder="Email address (optional)"
                value={details.email}
                onChange={set("email")}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="cd-form-error">{errors.email}</p>}
            </div>

            <div className="cd-form-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="co-notes">Notes for the kitchen</label>
              <textarea
                id="co-notes"
                rows={3}
                placeholder="Anything we should know? (no onions, extra napkins…)"
                value={details.notes}
                onChange={set("notes")}
              />
            </div>
          </div>

          <h3 style={{ marginTop: 24 }}>Payment</h3>
          <p>
            Pay at the store when you collect. Card payment on the site is not switched on
            yet, so every order is pay-at-store for now.
          </p>
        </div>

        <div className="cd-summary">
          <h3>Order summary</h3>
          <div className="cd-checkout-lines">
            {lines.map((line) => (
              <div key={line.lineKey} className="cd-checkout-line">
                <div className="cd-checkout-line__info">
                  <img src={line.imageUrl} alt="" width={48} height={48} />
                  <div>
                    <p className="cd-checkout-line__name">{line.name}</p>
                    <span className="cd-checkout-line__qty">Qty {line.qty}</span>
                  </div>
                </div>
                <span>
                  {line.priceCents === null
                    ? PRICE_PLACEHOLDER
                    : formatCents(line.priceCents * line.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="cd-summary-row">
            <span>Items</span>
            <span>{count}</span>
          </div>
          <div className="cd-summary-row cd-summary-row--total">
            <span>Total</span>
            <span>
              {subtotalCents === null ? "Confirmed at store" : formatCents(subtotalCents)}
            </span>
          </div>

          {submitError && (
            <p className="cd-form-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="cd-summary__actions">
            <button type="submit" disabled={submitting} className="cd-btn-solid">
              {submitting ? "Placing order…" : "Place pickup order"}
            </button>

            <Link href="/cart" className="cd-section-head__link">
              ← Back to cart
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
