"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import type { OrderItem } from "@/lib/orders/types";
import type { FoodItem } from "@/lib/data/types";

/**
 * Puts a past order back in the cart.
 *
 * The order stores only what was chosen — slug, size, flavors, ingredient
 * changes — so the lines are rebuilt from today's menu: current prices, and
 * anything since taken off the menu is left out rather than silently reordered.
 */
export default function ReorderButton({
  items,
  menu,
  className = "portal-btn",
}: {
  items: OrderItem[];
  menu: FoodItem[];
  className?: string;
}) {
  const { add, ready } = useCart();
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);

  function reorder() {
    const missing: string[] = [];
    let addedAny = false;

    for (const line of items) {
      const product = menu.find((p) => p.slug === line.productSlug);
      if (!product || product.hidden || !product.available) {
        missing.push(line.name);
        continue;
      }
      add(product, line.qty, {
        size: line.size,
        flavors: line.flavors,
        mods: line.mods,
      });
      addedAny = true;
    }

    if (!addedAny) {
      setNote("Nothing from that order is on the menu right now.");
      return;
    }
    if (missing.length > 0) {
      setNote(`${missing.join(", ")} could not be added — not on the menu right now.`);
      return;
    }
    router.push("/cart");
  }

  return (
    <>
      <button type="button" className={className} onClick={reorder} disabled={!ready}>
        <RotateCcw size={14} aria-hidden="true" /> Order again
      </button>
      {note && (
        <p className="portal-muted" style={{ fontSize: 12, marginTop: 6 }} role="status">
          {note}{" "}
          <a href="/cart" style={{ fontWeight: 700 }}>
            View cart
          </a>
        </p>
      )}
    </>
  );
}
