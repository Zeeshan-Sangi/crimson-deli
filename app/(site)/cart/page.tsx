import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import CartView from "@/components/site/CartView";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listAvailableProducts } from "@/lib/products/store";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your fresh food pickup order from Crimson Deli.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const signedIn = (await getCurrentUser()) !== null;

  // Current prices, so a cart saved days ago does not show a stale figure.
  const products = await listAvailableProducts();
  const menu = Object.fromEntries(
    products.map((p) => [p.slug, { name: p.name, priceCents: p.priceCents }]),
  );

  return (
    <>
      <Breadcrumb title="Cart" trail={[{ label: "Cart" }]} />
      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <CartView signedIn={signedIn} menu={menu} />
        </div>
      </section>
    </>
  );
}
