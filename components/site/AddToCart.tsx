"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import {
  formatFoodPrice,
  ICE_CREAM_SIZES,
  type FlavorChoices,
  type IceCreamSize,
  extraIngredients,
  flavorGroupsFor,
  flavorsComplete,
  iceCreamPriceCents,
  includedIngredients,
  isCustomisable,
  isIceCreamItem,
  modsPriceCents,
} from "@/lib/data/food-menu";
import { nutritionFor } from "@/lib/data/nutrition";
import type { FoodItem, ItemIngredient, ItemMods } from "@/lib/data/types";
import NutritionLabel from "@/components/site/NutritionLabel";

/** Quantity stepper + add-to-cart for a single fresh food item. */
export default function AddToCart({
  item,
  size: controlledSize,
  onSizeChange,
}: {
  item: FoodItem;
  size?: IceCreamSize;
  onSizeChange?: (size: IceCreamSize) => void;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [internalSize, setInternalSize] = useState<IceCreamSize>("small");
  const [flavors, setFlavors] = useState<FlavorChoices>({});
  const [flavorPrompt, setFlavorPrompt] = useState(false);
  const [mods, setMods] = useState<ItemMods>({ removed: [], added: [] });
  const sized = isIceCreamItem(item);
  const size = controlledSize ?? internalSize;

  // Water ice and gelati are made to order, so nothing is pre-selected: an
  // unnoticed default would send the kitchen a flavor nobody asked for.
  const flavorGroups = flavorGroupsFor(item);
  const flavorsChosen = flavorsComplete(item, flavors);

  const comesWith = includedIngredients(item);
  const extras = extraIngredients(item);
  const customisable = isCustomisable(item);

  function toggleRemoved(key: string) {
    setMods((prev) => ({
      ...prev,
      removed: prev.removed.includes(key)
        ? prev.removed.filter((k) => k !== key)
        : [...prev.removed, key],
    }));
    setAdded(false);
  }

  function toggleAdded(key: string) {
    setMods((prev) => ({
      ...prev,
      added: prev.added.includes(key)
        ? prev.added.filter((k) => k !== key)
        : [...prev.added, key],
    }));
    setAdded(false);
  }

  function setSize(next: IceCreamSize) {
    if (onSizeChange) onSizeChange(next);
    else setInternalSize(next);
  }

  function chooseFlavor(groupKey: string, option: string, multi?: boolean) {
    setFlavors((prev) => {
      if (!multi) return { ...prev, [groupKey]: option };
      const current = prev[groupKey];
      const list = Array.isArray(current)
        ? [...current]
        : typeof current === "string" && current
          ? [current]
          : [];
      const i = list.indexOf(option);
      if (i >= 0) list.splice(i, 1);
      else list.push(option);
      return { ...prev, [groupKey]: list };
    });
    setFlavorPrompt(false);
    setAdded(false);
  }

  function isFlavorSelected(groupKey: string, option: string): boolean {
    const picked = flavors[groupKey];
    if (Array.isArray(picked)) return picked.includes(option);
    return picked === option;
  }

  // Follows the cup size and every ingredient toggle, like the price below.
  const nutrition = nutritionFor(item, { size: sized ? size : undefined, mods });

  const basePriceCents = sized ? iceCreamPriceCents(size) : item.priceCents;
  // The price moves as extras go on, so the customer sees the cost of a change
  // before they commit to it — not at the counter.
  const unitPriceCents =
    basePriceCents === null ? null : basePriceCents + modsPriceCents(item, mods);

  function handleAdd() {
    if (!flavorsChosen) {
      setFlavorPrompt(true);
      return;
    }
    add(item, qty, {
      ...(sized ? { size } : {}),
      ...(flavorGroups.length > 0 ? { flavors } : {}),
      ...(customisable ? { mods } : {}),
    });
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

      {flavorGroups.map((group) => (
        <div key={group.key}>
          <p className="cd-product__meta" style={{ marginBottom: 8 }}>
            <strong>{group.label}</strong>
            {group.multi ? (
              <span style={{ fontWeight: 500, color: "var(--cd-muted)" }}>
                {" "}
                · pick one or more
              </span>
            ) : null}
          </p>
          <div
            className="cd-size-group"
            role={group.multi ? "group" : "radiogroup"}
            aria-label={group.label}
          >
            {group.options.map((option) => {
              const selected = isFlavorSelected(group.key, option);
              return (
                <button
                  key={option}
                  type="button"
                  role={group.multi ? "checkbox" : "radio"}
                  aria-checked={selected}
                  onClick={() => chooseFlavor(group.key, option, group.multi)}
                  className="cd-size-btn"
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {flavorPrompt && !flavorsChosen && (
        <p className="cd-product__fine" role="alert" style={{ color: "var(--cd-crimson)" }}>
          Choose {flavorGroups.some((g) => g.multi) ? "at least one flavor" : flavorGroups.length > 1 ? "both options" : "a flavor"} before adding this
          to your cart.
        </p>
      )}

      {customisable && (
        <div className="cd-customise">
          <p className="cd-customise__title">Make it your own</p>

          {comesWith.length > 0 && (
            <>
              <p className="cd-product__meta" style={{ marginBottom: 8 }}>
                <strong>Comes with</strong>
                <span style={{ fontWeight: 500, color: "var(--cd-muted)" }}>
                  {" "}
                  · tap to take something off
                </span>
              </p>
              <div className="cd-ingredient-grid">
                {comesWith.map((ingredient) => {
                  const off = mods.removed.includes(ingredient.key);
                  return (
                    <IngredientTile
                      key={ingredient.key}
                      ingredient={ingredient}
                      state={off ? "removed" : "included"}
                      pressed={!off}
                      ariaLabel={
                        off ? `Put ${ingredient.name} back` : `Remove ${ingredient.name}`
                      }
                      onToggle={() => toggleRemoved(ingredient.key)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {extras.length > 0 && (
            <>
              <p className="cd-product__meta" style={{ marginBottom: 8 }}>
                <strong>Add extras</strong>
              </p>
              <div className="cd-ingredient-grid">
                {extras.map((ingredient) => {
                  const on = mods.added.includes(ingredient.key);
                  return (
                    <IngredientTile
                      key={ingredient.key}
                      ingredient={ingredient}
                      state={on ? "added" : "available"}
                      pressed={on}
                      ariaLabel={`${on ? "Remove" : "Add"} ${ingredient.name}${
                        ingredient.priceCents > 0
                          ? `, ${formatFoodPrice(ingredient.priceCents)}`
                          : ""
                      }`}
                      onToggle={() => toggleAdded(ingredient.key)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
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

      {nutrition && (
        <NutritionLabel
          result={nutrition}
          sizeLabel={sized ? ICE_CREAM_SIZES[size].label : undefined}
          flavorsNotCounted={flavorGroups.length > 0}
        />
      )}

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

/**
 * One ingredient as a round photo with its name under it. Until the store adds
 * a photo, the circle shows the ingredient's first letter.
 */
function IngredientTile({
  ingredient,
  state,
  pressed,
  ariaLabel,
  onToggle,
}: {
  ingredient: ItemIngredient;
  /** On the item, taken off it, an extra not yet added, or an extra added. */
  state: "included" | "removed" | "available" | "added";
  pressed: boolean;
  ariaLabel: string;
  onToggle: () => void;
}) {
  const showsRemove = state === "included" || state === "added";
  return (
    <button
      type="button"
      className="cd-ingredient"
      data-state={state}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      <span className="cd-ingredient__photo">
        {ingredient.imageUrl ? (
          <img src={ingredient.imageUrl} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="cd-ingredient__initial" aria-hidden="true">
            {ingredient.name.charAt(0)}
          </span>
        )}
        <span className="cd-ingredient__badge" aria-hidden="true">
          {showsRemove ? <X size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
        </span>
      </span>
      <span className="cd-ingredient__name">{ingredient.name}</span>
      {ingredient.priceCents > 0 && (
        <span className="cd-ingredient__price">+{formatFoodPrice(ingredient.priceCents)}</span>
      )}
    </button>
  );
}
