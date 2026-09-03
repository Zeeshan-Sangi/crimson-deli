import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/site/Breadcrumb";
import AddToCart from "@/components/site/AddToCart";
import FoodCard from "@/components/site/FoodCard";
import IceCreamProductHero from "@/components/site/IceCreamProductHero";
import { foodCategories, formatFoodPrice, isIceCreamItem } from "@/lib/data/food-menu";
import { getVisibleProduct, listAvailableProducts } from "@/lib/products/store";
import { listForProduct, summaryForProduct } from "@/lib/reviews/store";
import ProductTabs from "@/components/site/ProductTabs";
import { Stars } from "@/components/site/StarRating";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getVisibleProduct(slug);
  if (!item) return { title: "Not found" };
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getVisibleProduct(slug);
  if (!item) notFound();

  const category = foodCategories.find((c) => c.slug === item.categorySlug);
  const related = (await listAvailableProducts())
    .filter((i) => i.categorySlug === item.categorySlug && i.slug !== item.slug)
    .slice(0, 3);

  const [reviews, reviewSummary] = await Promise.all([
    listForProduct(item.slug),
    summaryForProduct(item.slug),
  ]);

  return (
    <>
      <Breadcrumb
        title={item.name}
        trail={[{ label: "Fresh Food", href: "/food" }, { label: item.name }]}
      />

      <section className="cd-product cd-section--white">
        <div className="cd-page-wrap">
          {isIceCreamItem(item) ? (
            <IceCreamProductHero
              item={item}
              categoryName={category?.name}
              reviewSummary={reviewSummary}
            />
          ) : (
            <div className="cd-product__grid">
              <div className="cd-product__media">
                <img src={item.imageUrl} alt={item.name} decoding="async" />
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
                <p className="cd-product__price">{formatFoodPrice(item.priceCents)}</p>

                <p className="cd-product__meta">
                  Availability:{" "}
                  <strong>{item.available ? "In store" : "Sold out"}</strong>
                  {category && <> · {category.name}</>}
                </p>

                <p className="cd-product__desc">{item.description}</p>

                <AddToCart item={item} />

                <p className="cd-product__fine">
                  Made fresh at the counter and collected in-store. We do not deliver fresh
                  food. Prices are confirmed by the store at pickup.
                </p>
              </div>
            </div>
          )}

          <ProductTabs
            productSlug={item.slug}
            description={item.description}
            initialReviews={reviews}
            initialSummary={reviewSummary}
          />

          {related.length > 0 && (
            <div className="cd-product__related">
              <h3>More from {category?.name}</h3>
              <div className="cd-food-grid">
                {related.map((r, i) => (
                  <FoodCard key={r.slug} item={r} delay={`0.${2 + i}s`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
