import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import CartView from "@/components/site/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your fresh food pickup order from Crimson Deli.",
};

export default function CartPage() {
  return (
    <>
      <Breadcrumb title="Cart" trail={[{ label: "Cart" }]} />
      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <CartView />
        </div>
      </section>
    </>
  );
}
