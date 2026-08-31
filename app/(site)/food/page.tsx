import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import FoodCard from "@/components/site/FoodCard";
import { foodCategories } from "@/lib/data/food-menu";
import { listAvailableProducts } from "@/lib/products/store";

export const metadata: Metadata = {
  title: "Fresh Food",
  description:
    "Hoagies, deli sandwiches, fruit bowls, smoothies, coffee and ice cream, all made fresh at Crimson Deli. Pickup only.",
};

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const products = await listAvailableProducts();
  return (
    <>
      <Breadcrumb title="Fresh Food" trail={[{ label: "Fresh Food" }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-section-head">
            <span className="cd-section-head__eyebrow">Pickup only · order on our site</span>
            <h2>Fresh Food Menu</h2>
            <p>Made fresh at Crimson Deli. Browse, add to cart and pick up in-store.</p>
          </div>

          {foodCategories.map((category) => {
            const items = products.filter((p) => p.categorySlug === category.slug);
            if (items.length === 0) return null;
            return (
              <div key={category.slug} className="cd-food-category">
                <h3>{category.name}</h3>
                <div className="cd-food-grid">
                  {items.map((item, i) => (
                    <FoodCard key={item.slug} item={item} delay={`0.${2 + (i % 3)}s`} />
                  ))}
                </div>
              </div>
            );
          })}

          <p className="cd-food-menu-note">
            {products.length} items on the fresh food menu. Fresh food is pickup only, so
            we do not deliver it.
          </p>
        </div>
      </section>
    </>
  );
}
