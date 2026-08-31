"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import {
  formatFoodPrice,
  ICE_CREAM_SIZES,
  type IceCreamSize,
  iceCreamPriceCents,
  isIceCreamItem,
} from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";

/** Quantity stepper + add-to-cart for a single fresh food item. */
export default function AddToCart({ item }: { item: FoodItem }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<IceCreamSize>("small");
  const sized = isIceCreamItem(item);

  const unitPriceCents = sized ? iceCreamPriceCents(size) : item.priceCents;

  function handleAdd() {
    add(item, qty, sized ? { size } : undefined);
    setAdded(true);
  }

  return (
    <>
      {sized && (
        <>
          <p className="cd-product__meta" style={{ marginBottom: 8 }}>
            <strong>Cup size</strong>
          </p>
          <div className="cd-size-group" role="radiogroup" aria-label="Cup size">
            {(Object.keys(ICE_CREAM_SIZES) as IceCreamSize[]).map((key) => {
              const option = ICE_CREAM_SIZES[key];
              const selected = size === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSize(key)}
                  className="cd-size-btn"
                >
                  {option.label} · {formatFoodPrice(option.priceCents)}
                </button>
              );
            })}
          </div>
        </>
      )}

      <p className="cd-product__price">{formatFoodPrice(unitPriceCents)}</p>

      <p className="cd-product__meta" style={{ marginBottom: 8 }}>
        <strong>Quantity</strong>
      </p>
      <div className="cd-qty-row">
        <button
          type="button"
          className="cd-qty-btn"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="cd-qty-value" aria-label="Quantity">
          {qty}
        </span>
        <button
          type="button"
          className="cd-qty-btn"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
        >
          +
        </button>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!item.available}
          className="cd-btn-solid"
        >
          <ShoppingBag size={16} aria-hidden="true" /> Add to cart
        </button>

        <Link href="/food" className="cd-btn-solid cd-btn-solid--ghost">
          ← Back to menu
        </Link>
      </div>

      {added && (
        <p className="cd-product__fine" role="status">
          Added to your cart.{" "}
          <Link href="/cart" style={{ color: "var(--cd-crimson)", fontWeight: 700 }}>
            View cart
          </Link>
        </p>
      )}
    </>
  );
}
