import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/site/Breadcrumb";
import CheckoutView from "@/components/site/CheckoutView";
import { getCurrentUser } from "@/lib/auth/current-user";
import { findById } from "@/lib/auth/store";

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

  return (
    <>
      <Breadcrumb
        title="Checkout"
        trail={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <CheckoutView
            defaultName={account?.name ?? session.name}
            defaultPhone={account?.phone ?? ""}
            defaultEmail={account?.email ?? session.email}
          />
        </div>
      </section>
    </>
  );
}
