import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import CartView from "@/components/site/CartView";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your fresh food pickup order from Crimson Deli.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const signedIn = (await getCurrentUser()) !== null;

  return (
    <>
      <Breadcrumb title="Cart" trail={[{ label: "Cart" }]} />
      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <CartView signedIn={signedIn} />
        </div>
      </section>
    </>
  );
}
