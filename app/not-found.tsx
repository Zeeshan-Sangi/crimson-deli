import SiteHeader from "@/components/site/SiteHeader";
import { getCurrentUser } from "@/lib/auth/current-user";
import SiteFooter from "@/components/site/SiteFooter";
import NotFoundContent from "@/components/site/NotFoundContent";
import { CartProvider } from "@/lib/cart/CartContext";

// A URL that matches no route at all lands here, outside the (site) group, so
// this file pulls in the storefront chrome and stylesheets itself.
import "@/styles/crimson/legacy.css";
import "@/styles/crimson/reveal.css";
import "@/styles/crimson/expose.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page isn't on the menu at Crimson Deli.",
};

export default async function RootNotFound() {
  const session = await getCurrentUser();
  const user = session ? { name: session.name, role: session.role } : null;

  return (
    <CartProvider>
      <SiteHeader user={user} />
      <main>
        <NotFoundContent />
      </main>
      <SiteFooter />
    </CartProvider>
  );
}
