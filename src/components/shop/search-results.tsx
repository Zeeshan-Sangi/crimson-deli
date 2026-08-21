import Link from "next/link";
import ProductCard from "./product-card";
import { searchProducts } from "@/data/products";

/** Real results for the header search box, which previously went nowhere. */
export default function SearchResults({ query }: { query: string }) {
  const results = searchProducts(query);

  return (
    <>
      <div className="breadcrumb-wrapper hero-ptb p-relative z-index-1">
        <div className="container">
          <div className="page-heading">
            <h1>Search results</h1>
            <p className="text-white">
              {results.length === 0
                ? `Nothing matched “${query}”.`
                : `${results.length} ${results.length === 1 ? "item" : "items"} for “${query}”.`}
            </p>
          </div>
        </div>
      </div>

      <section className="food-category-section-4 section-padding fix">
        <div className="container">
          {results.length === 0 ? (
            <div className="text-center">
              <p>Try a different word, or browse the full menu.</p>
              <Link href="/menu" className="theme-btn mt-3">
                View the menu
              </Link>
            </div>
          ) : (
            <div className="row">
              {results.map((product) => (
                <div key={product.id} className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
