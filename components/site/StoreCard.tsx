import type { ConvenienceProduct } from "@/lib/data/types";

const CAT_LABELS: Record<string, string> = {
  drinks: "Drinks",
  snacks: "Snacks",
  candy: "Candy",
  frozen: "Frozen",
  "dairy-eggs": "Dairy & Eggs",
  pantry: "Pantry",
  household: "Household",
  mixed: "Essentials",
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

  return (
    <article className="cd-store-card">
      <a
        href={doordashUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cd-store-card__thumb"
      >
        <img src={img} alt={product.name} loading="lazy" decoding="async" />
        <span className="cd-store-card__badge">DoorDash</span>
      </a>
      <div className="cd-store-card__body">
        <h3 className="cd-store-card__title">
          <a href={doordashUrl} target="_blank" rel="noopener noreferrer">
            {product.name}
          </a>
        </h3>
        <p className="cd-store-card__meta">
          {label} · Delivered by DoorDash. Price may vary.
        </p>
        <div className="cd-store-card__foot">
          <span className="cd-store-card__price">{product.price}</span>
          <a
            href={doordashUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cd-btn-solid cd-store-card__btn"
          >
            Order ↗
          </a>
        </div>
      </div>
    </article>
  );
}
