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

/** The poster deal each in-store drink department carries, for its page description. */
const IN_STORE_DEALS: Record<string, string> = {
  "ryl-iced-tea": "1 for $2.69 or 2 for $5",
  "vinut-juice": "$5 a can",
  "vivo-cans": "1 for $2.09 or 2 for $3.50",
  "vivo-bottles": "1 for $2.99 or 2 for $5",
};

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
    description: found.slug in IN_STORE_DEALS
      ? `${found.name} at Crimson Deli, in-store on Ogontz Avenue. ${IN_STORE_DEALS[found.slug]}.`
      : `${found.name} at Crimson Deli, on our shelves in-store or delivered on DoorDash.`,
    alternates: { canonical: `/store/${found.slug}` },
  };
}

// What the store carries is edited in /admin/essentials, so this is read
// per request rather than frozen into the build.
export const dynamic = "force-dynamic";

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
  // The poster deals are counter-only; their pages have nothing on DoorDash to send people to.
  const inStoreOnly = products.length > 0 && products.every((p) => p.inStoreOnly);

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
              {inStoreOnly
                ? `${products.length} ${products.length === 1 ? "item" : "items"}, in-store only. Pick them up at the counter on Ogontz Avenue.`
                : products.length > 0
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
            {!inStoreOnly && (
              <a
                href={doordashUrl}
                target="_blank"
                rel="noopener"
                className="cd-btn-solid"
              >
                Browse {found.name} on DoorDash ↗
              </a>
            )}
            <Link href="/store" className="cd-btn-solid cd-btn-solid--ghost">
              ← All categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
