import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/site/Breadcrumb";
import StoreCard from "@/components/site/StoreCard";
import StorePagination, { paginateProducts, storePageUrl } from "@/components/site/StorePagination";
import {
  categoryImage,
  getCatalog,
  stockedCategories,
} from "@/lib/data/convenience";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Everyday Essentials",
  description:
    "Snacks, drinks, dairy, frozen and household items on our shelves at Crimson Deli, or ordered for delivery on DoorDash.",
};

function PopularItem({
  product,
  doordashUrl,
}: {
  product: { name: string; price: string; img?: string; slug: string };
  doordashUrl: string;
}) {
  const img =
    product.img || "/assets/img/crimson/convenience/categories/drinks.png";
  return (
    <div className="cd-popular-item">
      <a
        href={doordashUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cd-popular-item__thumb"
      >
        <img src={img} alt={product.name} loading="lazy" decoding="async" />
      </a>
      <div>
        <a
          href={doordashUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cd-popular-item__name"
        >
          {product.name}
        </a>
        <div className="cd-popular-item__price">{product.price}</div>
      </div>
    </div>
  );
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = parseInt(pageParam ?? "1", 10);
  const { products, doordashUrl } = await getCatalog();
  const categories = await stockedCategories();
  const { items, page, totalPages, start, end } = paginateProducts(
    products,
    requestedPage,
  );

  if (requestedPage > 1 && requestedPage > totalPages) {
    redirect(storePageUrl(totalPages));
  }

  const popular = products.slice(0, 2);

  return (
    <>
      <Breadcrumb title="Everyday Essentials" trail={[{ label: "Everyday Essentials" }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-banner">
            <Truck size={24} aria-hidden="true" />
            <div>
              <strong>Everyday essentials, delivered by DoorDash</strong>
              <p>
                Browse our in-store catalog below. Tap any item to order on{" "}
                <a href={doordashUrl} target="_blank" rel="noopener noreferrer">
                  Crimson Deli on DoorDash ↗
                </a>
                .
              </p>
            </div>
          </div>

          <div className="cd-store-layout">
            <aside className="cd-store-sidebar">
              <div className="cd-panel">
                <h4>Categories</h4>
                <div>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/store/${category.slug}`}
                      className="cd-cat-link"
                    >
                      <span>
                        <img
                          src={categoryImage(category.slug)}
                          alt=""
                          width={24}
                          height={24}
                        />
                        {category.name}
                      </span>
                      <span className="cd-cat-link__count">{category.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="cd-panel">
                <h4>Popular on DoorDash</h4>
                <div style={{ display: "grid", gap: 16 }}>
                  {popular.map((product) => (
                    <PopularItem
                      key={product.slug}
                      product={product}
                      doordashUrl={doordashUrl}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <div>
              <div className="cd-store-toolbar">
                Showing {products.length ? start + 1 : 0}-{end} of {products.length} items ·
                page {page} of {totalPages}
              </div>

              <div className="cd-store-grid">
                {items.map((product) => (
                  <StoreCard
                    key={product.slug}
                    product={product}
                    doordashUrl={doordashUrl}
                  />
                ))}
              </div>

              <StorePagination page={page} totalPages={totalPages} />

              <div className="cd-store-cta">
                <a
                  href={doordashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cd-btn-solid"
                >
                  Browse full catalog on DoorDash ↗
                </a>
                <p>Prices from DoorDash · subject to change</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
