import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/site/Breadcrumb";
import StoreCard from "@/components/site/StoreCard";
import {
  convenienceCategories,
  getCatalog,
  getCategory,
  productsInCategory,
} from "@/lib/data/convenience";

export function generateStaticParams() {
  return convenienceCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) return { title: "Not found" };
  return {
    title: `${found.name} · Everyday Essentials`,
    description: `${found.name} at Crimson Deli, on our shelves in-store or delivered on DoorDash.`,
  };
}

export default async function StoreCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const products = await productsInCategory(category);
  const { doordashUrl } = await getCatalog();

  return (
    <>
      <Breadcrumb
        title={found.name}
        trail={[
          { label: "Everyday Essentials", href: "/store" },
          { label: found.name },
        ]}
      />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-section-head">
            <h2>{found.name}</h2>
            <p>
              {products.length > 0
                ? `${products.length} ${products.length === 1 ? "item" : "items"} in our catalog. Pick them up in-store, or order for delivery on DoorDash.`
                : "This department is on our shelves in-store. The catalog listing is still being added, so the full range is on DoorDash."}
            </p>
          </div>

          {products.length > 0 && (
            <div className="cd-store-grid" style={{ marginBottom: 32 }}>
              {products.map((product) => (
                <StoreCard key={product.slug} product={product} doordashUrl={doordashUrl} />
              ))}
            </div>
          )}

          <div className="cd-hero__actions" style={{ justifyContent: "center" }}>
            <a
              href={doordashUrl}
              target="_blank"
              rel="noopener"
              className="cd-btn-solid"
            >
              Browse {found.name} on DoorDash ↗
            </a>
            <Link href="/store" className="cd-btn-solid cd-btn-solid--ghost">
              ← All categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
