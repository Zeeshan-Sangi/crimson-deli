"use client";

import { useState } from "react";
import AddToCart from "@/components/site/AddToCart";
import { Stars } from "@/components/site/StarRating";
import {
  iceCreamCupImage,
  type IceCreamSize,
} from "@/lib/data/food-menu";
import type { FoodItem } from "@/lib/data/types";
import type { ReviewSummary } from "@/lib/reviews/types";

/** Ice cream detail: cup photo swaps when Small / Large is chosen. */
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
  const imageUrl = iceCreamCupImage(item.slug, size);

  return (
    <div className="cd-product__grid">
      <div className="cd-product__media">
        <img src={imageUrl} alt={`${item.name} — ${size} cup`} decoding="async" />
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

        <AddToCart item={item} size={size} onSizeChange={setSize} />

        <p className="cd-product__fine">
          Made fresh at the counter and collected in-store. We do not deliver fresh
          food. Prices are confirmed by the store at pickup.
        </p>
      </div>
    </div>
  );
}
