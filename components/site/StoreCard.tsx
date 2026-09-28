import type { ConvenienceProduct } from "@/lib/data/types";
import { siteConfig } from "@/lib/site-config";

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  siteConfig.address,
)}`;

const CAT_LABELS: Record<string, string> = {
  drinks: "Drinks",
  snacks: "Snacks",
  candy: "Candy",
  frozen: "Frozen",
  "dairy-eggs": "Dairy & Eggs",
  pantry: "Pantry",
  household: "Household",
  mixed: "Essentials",
  "ryl-iced-tea": "The Ryl Co. Iced Tea",
  "vinut-juice": "Vinut 100% Juice",
  "vivo-cans": "Vivo Fruit Drink Cans",
  "vivo-bottles": "Vivo Fruit Drink Bottles",
};

export default function StoreCard({
  product,
  doordashUrl,
}: {
  product: ConvenienceProduct;
  doordashUrl: string;
}) {
  const label = product.catLabel || CAT_LABELS[product.cat] || "Essentials";
  const img = product.img || "/assets/img/crimson/convenience/categories/drinks.png";

  if (product.inStoreOnly) {
    return (
      <article className="cd-store-card">
        <div className="cd-store-card__media-wrap">
          <div className="cd-store-card__thumb">
            <img src={img} alt={product.name} loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="cd-store-card__body">
          <div className="cd-store-card__header">
            <h3 className="cd-store-card__title">{product.name}</h3>
            <span className="cd-card-price-badge">{product.price}</span>
          </div>

          <p className="cd-store-card__meta">In-store only. Pick it up at the counter.</p>

          <div className="cd-card-tags">
            <span className="cd-card-tag cd-card-tag--primary">In-store</span>
            {/* Names end "(… x 2)" and get cut off, so the pack size shows as its own tag. */}
            {/ x 2\)$/.test(product.name) && (
              <span className="cd-card-tag cd-card-tag--primary">2-Pack deal</span>
            )}
            <span className="cd-card-tag">{label}</span>
          </div>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cd-card-btn"
          >
            Get directions ↗
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="cd-store-card">
      <div className="cd-store-card__media-wrap">
        <a
          href={doordashUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cd-store-card__thumb"
        >
          <img src={img} alt={product.name} loading="lazy" decoding="async" />
        </a>
      </div>

      <div className="cd-store-card__body">
        <div className="cd-store-card__header">
          <h3 className="cd-store-card__title">
            <a href={doordashUrl} target="_blank" rel="noopener noreferrer">
              {product.name}
            </a>
          </h3>
          <span className="cd-card-price-badge">{product.price}</span>
        </div>

        <p className="cd-store-card__meta">
          In-store price. DoorDash charges its own for delivery to your door.
        </p>

        <div className="cd-card-tags">
          <span className="cd-card-tag cd-card-tag--doordash">DoorDash</span>
          <span className="cd-card-tag">{label}</span>
        </div>

        <a
          href={doordashUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cd-card-btn cd-card-btn--doordash"
        >
          Order on DoorDash ↗
        </a>
      </div>
    </article>
  );
}

