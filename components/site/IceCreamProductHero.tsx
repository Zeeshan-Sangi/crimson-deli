"use client";

import { useState } from "react";
import AddToCart from "@/components/site/AddToCart";
import { Stars } from "@/components/site/StarRating";
import {
  WATER_ICE_FLAVORS,
  iceCreamCupImage,
  waterIceFlavorImage,
  waterIceImage,
  type FlavorChoices,
  type IceCreamSize,
} from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";
import type { ReviewSummary } from "@/lib/reviews/types";

/** Ice cream detail: cup photo swaps when Small / Large (or water ice flavor) is chosen. */
export default function IceCreamProductHero({
  item,
  categoryName,
  reviewSummary,
}: {
  item: FoodItem;
  categoryName?: string;
  reviewSummary: ReviewSummary;
}) {
  const [size, setSize] = useState<IceCreamSize>("small");
  const [flavors, setFlavors] = useState<FlavorChoices>({});
  const isWaterIce = item.slug === "water-ice";
  const imageUrl = isWaterIce
    ? waterIceImage(size, flavors.flavor)
    : iceCreamCupImage(item.slug, size);

  const selectedFlavor = (() => {
    const picked = flavors.flavor;
    if (Array.isArray(picked) && picked.length === 1) return picked[0];
    if (typeof picked === "string" && picked) return picked;
    return null;
  })();

  function pickFlavorThumb(flavor: string) {
    setFlavors({ flavor: [flavor] });
  }

  // The arrows step through the flavors that have a photo, wrapping at the ends.
  const photoFlavors: string[] = WATER_ICE_FLAVORS.filter((f) => waterIceFlavorImage(f));
  function stepFlavor(dir: 1 | -1) {
    const at = selectedFlavor ? photoFlavors.indexOf(selectedFlavor) : -1;
    const next =
      at === -1
        ? dir === 1 ? 0 : photoFlavors.length - 1
        : (at + dir + photoFlavors.length) % photoFlavors.length;
    pickFlavorThumb(photoFlavors[next]);
  }

  return (
    <div className="cd-product__grid">
      <div className="cd-product__media-wrap">
        <div className="cd-product__media">
          <img
            src={imageUrl}
            alt={
              selectedFlavor
                ? `${item.name}, ${selectedFlavor}, ${size} cup`
                : `${item.name}, ${size} cup`
            }
            decoding="async"
          />
          {isWaterIce && photoFlavors.length > 1 && (
            <>
              <button
                type="button"
                className="cd-product__arrow cd-product__arrow--prev"
                aria-label="Previous flavor"
                onClick={() => stepFlavor(-1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="cd-product__arrow cd-product__arrow--next"
                aria-label="Next flavor"
                onClick={() => stepFlavor(1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {isWaterIce && (
          <div className="cd-flavor-thumbs" role="list" aria-label="Water ice flavors">
            {WATER_ICE_FLAVORS.map((flavor) => {
              const src = waterIceFlavorImage(flavor);
              if (!src) return null;
              const active = selectedFlavor === flavor;
              return (
                <button
                  key={flavor}
                  type="button"
                  role="listitem"
                  className={`cd-flavor-thumb${active ? " is-active" : ""}`}
                  aria-pressed={active}
                  aria-label={flavor}
                  onClick={() => pickFlavorThumb(flavor)}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                  <span>{flavor}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <span className="cd-product__eyebrow">PICKUP ONLY</span>
        <h2 className="cd-product__title">{item.name}</h2>

        {reviewSummary.count > 0 && (
          <p className="cd-product__rating">
            <Stars value={reviewSummary.average ?? 0} />
            <span>
              {reviewSummary.average?.toFixed(1)} · {reviewSummary.count} review
              {reviewSummary.count === 1 ? "" : "s"}
            </span>
          </p>
        )}

        <p className="cd-product__meta">
          Availability:{" "}
          <strong>{item.available ? "In store" : "Sold out"}</strong>
          {categoryName && <> · {categoryName}</>}
        </p>

        <p className="cd-product__desc">{item.description}</p>

        <AddToCart
          item={item}
          size={size}
          onSizeChange={setSize}
          flavors={isWaterIce ? flavors : undefined}
          onFlavorChange={isWaterIce ? setFlavors : undefined}
        />

        <p className="cd-product__fine">
          Made fresh at the counter and collected in-store. We do not deliver fresh
          food. Prices are confirmed by the store at pickup.
        </p>
      </div>
    </div>
  );
}
