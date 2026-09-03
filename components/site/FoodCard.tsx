import Link from "next/link";
import type { FoodItem } from "@/lib/data/types";
import {
  formatFoodPrice,
  ICE_CREAM_SIZES,
  isIceCreamItem,
} from "@/lib/data/food-menu";
import { Clock, Store } from "lucide-react";

/** Fresh food card — Phase 2 brand styling. */
export default function FoodCard({ item, delay }: { item: FoodItem; delay?: string }) {
  const priceLabel = isIceCreamItem(item)
    ? `${formatFoodPrice(ICE_CREAM_SIZES.small.priceCents)} / ${formatFoodPrice(ICE_CREAM_SIZES.large.priceCents)}`
    : formatFoodPrice(item.priceCents);

  return (
    <article className="cd-food-card wow fadeInUp" data-wow-delay={delay}>
      <Link href={`/food/${item.slug}`} className="cd-food-card__thumb">
        <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
        <span className="cd-food-card__badge">Pickup only</span>
      </Link>

      <div className="cd-food-card__body">
        <h3 className="cd-food-card__title">
          <Link href={`/food/${item.slug}`}>{item.name}</Link>
        </h3>

        <div className="cd-food-card__meta">
          <span>
            <Store size={14} aria-hidden="true" /> Pickup in-store
          </span>
          <span>
            <Clock size={14} aria-hidden="true" /> Made fresh
          </span>
        </div>

        <p className="cd-food-card__desc">{item.description}</p>

        <div className="cd-food-card__foot">
          <span className="cd-food-card__price">{priceLabel}</span>
          <Link href={`/food/${item.slug}`} className="cd-btn-solid cd-food-card__btn">
            View &amp; order
          </Link>
        </div>
      </div>
    </article>
  );
}

