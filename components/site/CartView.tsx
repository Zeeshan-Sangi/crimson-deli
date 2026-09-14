"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Check, Minus, Plus, X } from "lucide-react";
import { formatCents, useCart, type CartLine } from "@/lib/cart/CartContext";
import { ICE_CREAM_SIZES, UNPRICED_LABEL, flavorValues } from "@/lib/data/food-menu";
import { siteConfig } from "@/lib/site-config";

type MenuPrices = Record<string, { name: string; priceCents: number | null }>;

/**
 * What was chosen for a line, e.g. `["Small Cup", "Cherry"]` or `["No Onion"]`.
 *
 * The line name already carries all of this, but as one run-on string. Size and
 * flavors come from the line itself; ingredient changes are only kept by key,
 * so their readable form is the bracketed tail the cart wrote into the name.
 */
function lineDetails(line: CartLine): string[] {
  const parts: string[] = [];
  if (line.size) parts.push(ICE_CREAM_SIZES[line.size].label);
  parts.push(...flavorValues(line.slug, line.flavors));
  if ((line.mods?.removed.length ?? 0) + (line.mods?.added.length ?? 0) > 0) {
    const changes = line.name.match(/\(([^()]*)\)$/);
    if (changes) parts.push(changes[1]);
  }
  return parts;
}

export default function CartView({
  signedIn = false,
  menu,
  prepMinutes,
}: {
  signedIn?: boolean;
  menu?: MenuPrices;
  prepMinutes?: number;
}) {
  const { lines, count, subtotalCents, ready, setQty, remove, clear, syncPrices } = useCart();

  // Runs again once `ready` flips: the provider loads the stored cart in its
  // own effect, so on first pass there is nothing here to correct yet.
  useEffect(() => {
    if (ready && menu) syncPrices(menu);
  }, [ready, menu, syncPrices]);

  const head = (
    <header className="cd-bag__head">
      <div>
        <p className="cd-bag__eyebrow">Pickup order</p>
        <h1 className="cd-bag__title">Your cart</h1>
      </div>
      <Link href="/food" className="cd-bag__continue">
        <ArrowLeft size={16} aria-hidden="true" />
        Continue shopping
      </Link>
    </header>
  );

  if (!ready) {
    return (
      <div className="cd-bag" aria-busy="true">
        {head}
        <div className="cd-bag__skeleton" aria-hidden="true">
          <span />
          <span />
        </div>
        <p className="sr-only">Loading your cart</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="cd-bag">
        {head}
        <div className="cd-bag__empty">
          <h2>Nothing in here yet</h2>
          <p>
            Fresh food is made at the counter and collected in-store. Add something from
            the menu and it will wait here for you.
          </p>
          <Link href="/food" className="cd-btn-solid">
            Browse fresh food
          </Link>
        </div>
      </div>
    );
  }

  const checkoutHref = signedIn ? "/checkout" : "/login?next=%2Fcheckout";

  return (
    <div className="cd-bag">
      {head}

      <div className="cd-bag__cols" aria-hidden="true">
        <span>Item</span>
        <span>Price</span>
        <span>Qty</span>
        <span>Total</span>
        <span />
      </div>

      <ul className="cd-bag__lines">
        {lines.map((line) => {
          const title = menu?.[line.slug]?.name ?? line.name;
          const details = lineDetails(line);
          const unit = line.priceCents === null ? UNPRICED_LABEL : formatCents(line.priceCents);
          return (
            <li key={line.lineKey} className="cd-bag__line">
              <Link href={`/food/${line.slug}`} className="cd-bag__thumb" tabIndex={-1}>
                <img src={line.imageUrl} alt="" width={80} height={80} />
              </Link>

              <div className="cd-bag__info">
                <Link href={`/food/${line.slug}`} className="cd-bag__name">
                  {title}
                </Link>
                {details.length > 0 && (
                  <p className="cd-bag__details">{details.join(" · ")}</p>
                )}
                <p className="cd-bag__unit">{unit} each</p>
              </div>

              <p className="cd-bag__price">{unit}</p>

              <div className="cd-bag__qty">
                <button
                  type="button"
                  aria-label={`Decrease ${title}`}
                  onClick={() => setQty(line.lineKey, line.qty - 1)}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span aria-label={`Quantity of ${title}`}>{line.qty}</span>
                <button
                  type="button"
                  aria-label={`Increase ${title}`}
                  onClick={() => setQty(line.lineKey, line.qty + 1)}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>

              <p className="cd-bag__total">
                {line.priceCents === null ? "N/A" : formatCents(line.priceCents * line.qty)}
              </p>

              <button
                type="button"
                className="cd-bag__remove"
                aria-label={`Remove ${title}`}
                onClick={() => remove(line.lineKey)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <button type="button" className="cd-bag__clear" onClick={clear}>
        Clear cart
      </button>

      <div className="cd-bag__bar">
        <section className="cd-bag__pickup" aria-labelledby="cd-bag-pickup">
          <h2 id="cd-bag-pickup">How you&apos;ll get it</h2>
          <div className="cd-bag__mode" data-on="true">
            <span className="cd-bag__tick" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
            <div>
              <p className="cd-bag__mode-name">
                Store pickup <span>Free</span>
              </p>
              <p className="cd-bag__mode-note">
                {prepMinutes ? `Ready in about ${prepMinutes} min at ` : "Collect at "}
                {siteConfig.street}
              </p>
            </div>
          </div>
          <div className="cd-bag__mode" data-on="false">
            <span className="cd-bag__tick" aria-hidden="true" />
            <div>
              <p className="cd-bag__mode-name">
                Delivery <span>Not for fresh food</span>
              </p>
              <p className="cd-bag__mode-note">
                Everyday essentials deliver through DoorDash.{" "}
                <Link href="/store">Shop essentials</Link>
              </p>
            </div>
          </div>
        </section>

        <section className="cd-bag__totals" aria-label="Order total">
          <dl>
            <div>
              <dt>Items</dt>
              <dd>{count}</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>Free</dd>
            </div>
            <div className="cd-bag__subtotal">
              <dt>Subtotal</dt>
              <dd>{subtotalCents === null ? "Confirmed at store" : formatCents(subtotalCents)}</dd>
            </div>
          </dl>
          {subtotalCents === null && (
            <p className="cd-bag__fine">
              Some prices are not set yet, so the store confirms the total when you collect.
            </p>
          )}
          <Link href={checkoutHref} className="cd-bag__checkout">
            <span>{signedIn ? "Checkout" : "Sign in to check out"}</span>
            {subtotalCents !== null && <span>{formatCents(subtotalCents)}</span>}
          </Link>
          <p className="cd-bag__fine">You pay at the counter when you collect.</p>
        </section>
      </div>
    </div>
  );
}
