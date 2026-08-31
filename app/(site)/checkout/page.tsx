import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import CheckoutView from "@/components/site/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place a fresh food pickup order at Crimson Deli, Ogontz Avenue.",
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb
        title="Checkout"
        trail={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <CheckoutView />
        </div>
      </section>
    </>
  );
}
