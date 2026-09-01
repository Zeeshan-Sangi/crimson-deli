"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ICE_CREAM_SIZES,
  type IceCreamSize,
  iceCreamPriceCents,
  isIceCreamItem,
} from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";

/**
 * Cart for fresh food only.
 *
 * CLAUDE.md is explicit: convenience items never enter a cart — they link out to
 * DoorDash. So this only ever holds `FoodItem`s, all of them pickup.
 */
export type CartLine = {
  /** Unique row id — slug, or slug:size for ice cream variants. */
  lineKey: string;
  slug: string;
  name: string;
  imageUrl: string;
  /** Cents, or null when the store has not given us a real price yet. */
  priceCents: number | null;
  qty: number;
  size?: IceCreamSize;
};

type AddOptions = {
  size?: IceCreamSize;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  /** Sum in cents, or null if any line has no known price. */
  subtotalCents: number | null;
  ready: boolean;
  add: (item: FoodItem, qty?: number, options?: AddOptions) => void;
  setQty: (lineKey: string, qty: number) => void;
  remove: (lineKey: string) => void;
  clear: () => void;
  /**
   * Re-points stored lines at the menu's current name and price.
   *
   * A cart lives in localStorage, so a line keeps whatever price it was added
   * at — days later that can be wrong, or still say "no price" for an item the
   * store has since priced. The server recomputes every total at checkout, so
   * this only ever corrected the display, but showing a customer a figure they
   * will not be charged is its own problem.
   */
  syncPrices: (menu: Record<string, { name: string; priceCents: number | null }>) => void;
};

const STORAGE_KEY = "crimson-cart-v2";
const CartContext = createContext<CartValue | null>(null);

function lineKeyFor(slug: string, size?: IceCreamSize): string {
  return size ? `${slug}:${size}` : slug;
}

function cartLineName(item: FoodItem, size?: IceCreamSize): string {
  if (isIceCreamItem(item) && size) {
    return `${item.name} (${ICE_CREAM_SIZES[size].label})`;
  }
  return item.name;
}

function cartLinePrice(item: FoodItem, size?: IceCreamSize): number | null {
  if (isIceCreamItem(item) && size) return iceCreamPriceCents(size);
  return item.priceCents;
}

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l &&
        typeof l.lineKey === "string" &&
        typeof l.slug === "string" &&
        typeof l.qty === "number" &&
        l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  // `ready` avoids a hydration mismatch: the server renders an empty cart, and
  // the stored one is only applied after mount.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private mode / blocked storage — the cart just won't survive a reload.
    }
  }, [lines, ready]);

  const add = useCallback((item: FoodItem, qty = 1, options?: AddOptions) => {
    const size = isIceCreamItem(item) ? options?.size ?? "small" : options?.size;
    const lineKey = lineKeyFor(item.slug, size);

    setLines((prev) => {
      const existing = prev.find((l) => l.lineKey === lineKey);
      if (existing) {
        return prev.map((l) =>
          l.lineKey === lineKey ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [
        ...prev,
        {
          lineKey,
          slug: item.slug,
          name: cartLineName(item, size),
          imageUrl: item.imageUrl,
          priceCents: cartLinePrice(item, size),
          qty,
          size,
        },
      ];
    });
  }, []);

  const setQty = useCallback((lineKey: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.lineKey !== lineKey)
        : prev.map((l) => (l.lineKey === lineKey ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((lineKey: string) => {
    setLines((prev) => prev.filter((l) => l.lineKey !== lineKey));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const syncPrices = useCallback(
    (menu: Record<string, { name: string; priceCents: number | null }>) => {
      setLines((prev) => {
        let changed = false;
        const next = prev.map((l) => {
          const current = menu[l.slug];
          if (!current) return l;
          // Ice cream lines carry a size-derived price, so only the name is
          // refreshed for those — the size price is computed, not stored.
          const priceCents = l.size ? l.priceCents : current.priceCents;
          if (priceCents === l.priceCents && current.name === l.name) return l;
          changed = true;
          return { ...l, priceCents, name: l.size ? l.name : current.name };
        });
        return changed ? next : prev;
      });
    },
    [],
  );

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const anyUnpriced = lines.some((l) => l.priceCents === null);
    const subtotalCents = anyUnpriced
      ? null
      : lines.reduce((sum, l) => sum + (l.priceCents ?? 0) * l.qty, 0);
    return { lines, count, subtotalCents, ready, add, setQty, remove, clear, syncPrices };
  }, [lines, ready, add, setQty, remove, clear, syncPrices]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
