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
  type FlavorChoices,
  type IceCreamSize,
  cleanMods,
  flavorSuffix,
  flavorValues,
  hasMods,
  iceCreamCupImage,
  iceCreamPriceCents,
  isIceCreamItem,
  modsPriceCents,
  modsSuffix,
} from "@/lib/data/food-menu";
import type { FoodItem, ItemMods } from "@/lib/data/types";

/**
 * Cart for fresh food only.
 *
 * The project brief is explicit: convenience items never enter a cart — they link out to
 * DoorDash. So this only ever holds `FoodItem`s, all of them pickup.
 */
export type CartLine = {
  /** Unique row id — slug, plus the size and flavors that make this variant. */
  lineKey: string;
  slug: string;
  name: string;
  imageUrl: string;
  /** Cents, or null when the store has not given us a real price yet. */
  priceCents: number | null;
  qty: number;
  size?: IceCreamSize;
  /** Flavors chosen for items that ask for them (water ice, gelati). */
  flavors?: FlavorChoices;
  /** Ingredients taken off and extras added on. */
  mods?: ItemMods;
};

type AddOptions = {
  size?: IceCreamSize;
  flavors?: FlavorChoices;
  mods?: ItemMods;
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

function lineKeyFor(
  slug: string,
  size?: IceCreamSize,
  flavors?: FlavorChoices,
  mods?: ItemMods,
): string {
  // Two cherry water ices and one mango are two rows, not one, and so is a
  // hoagie with no tomato next to a plain one — everything the customer chose
  // is part of the row identity, just like the cup size is.
  const parts = [
    slug,
    size,
    ...flavorValues(slug, flavors),
    ...(mods?.removed ?? []).map((k) => `-${k}`),
    ...(mods?.added ?? []).map((k) => `+${k}`),
  ].filter(Boolean);
  return parts.join(":");
}

function cartLineName(
  item: FoodItem,
  size?: IceCreamSize,
  flavors?: FlavorChoices,
  mods?: ItemMods,
): string {
  const base =
    isIceCreamItem(item) && size
      ? `${item.name} (${ICE_CREAM_SIZES[size].label})`
      : item.name;
  return `${base}${flavorSuffix(item.slug, flavors)}${modsSuffix(item, mods)}`;
}

function cartLinePrice(
  item: FoodItem,
  size?: IceCreamSize,
  mods?: ItemMods,
): number | null {
  const base = isIceCreamItem(item) && size ? iceCreamPriceCents(size) : item.priceCents;
  // Extras cannot be added to a price nobody has given us yet — the store
  // confirms the whole line at pickup in that case.
  if (base === null) return null;
  return base + modsPriceCents(item, mods);
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
    const flavors = options?.flavors;
    const cleaned = cleanMods(item, options?.mods);
    const mods = hasMods(cleaned) ? cleaned : undefined;
    const lineKey = lineKeyFor(item.slug, size, flavors, mods);

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
          name: cartLineName(item, size, flavors, mods),
          imageUrl: size ? iceCreamCupImage(item.slug, size) : item.imageUrl,
          priceCents: cartLinePrice(item, size, mods),
          qty,
          size,
          flavors,
          mods,
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
          // A line whose name and price spell out a size, flavors or changed
          // ingredients keeps both: the menu only knows the plain product.
          const variant = Boolean(l.size) || Boolean(l.flavors) || hasMods(l.mods);
          const priceCents = variant ? l.priceCents : current.priceCents;
          const name = variant ? l.name : current.name;
          if (priceCents === l.priceCents && name === l.name) return l;
          changed = true;
          return { ...l, priceCents, name };
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
