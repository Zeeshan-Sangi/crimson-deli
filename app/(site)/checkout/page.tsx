import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/site/Breadcrumb";
import CheckoutView from "@/components/site/CheckoutView";
import { getCurrentUser } from "@/lib/auth/current-user";
import { findById } from "@/lib/auth/store";
import { listAvailableProducts } from "@/lib/products/store";
import { getSettings } from "@/lib/settings/store";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place a fresh food pickup order at Crimson Deli, Ogontz Avenue.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Ordering requires an account. Sending them through /login with `next` set
  // means they land back on checkout with their cart intact.
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=%2Fcheckout");

  // Name and phone are already on file — no reason to make them type it again.
  const account = await findById(session.id);

  // Same reason as the cart: the stored cart must not decide what a line costs.
  const products = await listAvailableProducts();
  const menu = Object.fromEntries(
    products.map((p) => [p.slug, { name: p.name, priceCents: p.priceCents }]),
  );
  const { checkout } = await getSettings();

  return (
    <>
      <Breadcrumb
        title="Checkout"
        trail={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <CheckoutView
            menu={menu}
            defaultName={account?.name ?? session.name}
            defaultPhone={account?.phone ?? ""}
            defaultEmail={account?.email ?? session.email}
            taxRate={checkout.taxRate}
            taxIncludedInPrice={checkout.taxIncludedInPrice}
          />
        </div>
      </section>
    </>
  );
}
