import Link from "next/link";
import type { FoodItem } from "@/lib/data/types";
import {
  formatFoodPrice,
  ICE_CREAM_SIZES,
  isIceCreamItem,
} from "@/lib/data/food-menu";

/** Fresh food card — Modern high-aesthetic design matching reference UI */
export default function FoodCard({ item, delay }: { item: FoodItem; delay?: string }) {
  const priceLabel = isIceCreamItem(item)
    ? `From ${formatFoodPrice(ICE_CREAM_SIZES.small.priceCents)}`
    : formatFoodPrice(item.priceCents);

  const tag1 = item.available ? "Top Pick" : "Sold Out";
  const tag2 = "Pickup in-store";

  return (
    <article className="cd-food-card wow fadeInUp" data-wow-delay={delay}>
      <div className="cd-food-card__media-wrap">
        <Link href={`/food/${item.slug}`} className="cd-food-card__thumb">
          <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
        </Link>
      </div>

      <div className="cd-food-card__body">
        <div className="cd-food-card__header">
          <h3 className="cd-food-card__title">
            <Link href={`/food/${item.slug}`}>{item.name}</Link>
          </h3>
          <span className="cd-card-price-badge">{priceLabel}</span>
        </div>

        <p className="cd-food-card__desc">{item.description}</p>

        <div className="cd-card-tags">
          <span className={`cd-card-tag ${item.available ? "cd-card-tag--primary" : "cd-card-tag--muted"}`}>
            {tag1}
          </span>
          <span className="cd-card-tag">{tag2}</span>
        </div>

        <Link href={`/food/${item.slug}`} className="cd-card-btn">
          Add to Cart
        </Link>
      </div>
    </article>
  );
}


