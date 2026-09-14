import type { Metadata } from "next";
import CartView from "@/components/site/CartView";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listAvailableProducts } from "@/lib/products/store";
import { getSettings } from "@/lib/settings/store";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Cart",
  description: "Your fresh food pickup order from Crimson Deli.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const signedIn = (await getCurrentUser()) !== null;

  // Current prices, so a cart saved days ago does not show a stale figure.
  const [products, { store }] = await Promise.all([listAvailableProducts(), getSettings()]);
  const menu = Object.fromEntries(
    products.map((p) => [p.slug, { name: p.name, priceCents: p.priceCents }]),
  );

  return (
    <>
      {/* No breadcrumb band: the cart carries its own heading, so the items sit
          near the top of the page instead of under a second title. */}
      <section className="cd-section cd-section--cream cd-bag-section">
        <div className="cd-page-wrap">
          <CartView signedIn={signedIn} menu={menu} prepMinutes={store.prepTimeMinutes} />
        </div>
      </section>
    </>
  );
}
