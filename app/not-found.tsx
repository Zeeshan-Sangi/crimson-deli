import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import NotFoundContent from "@/components/site/NotFoundContent";
import { CartProvider } from "@/lib/cart/CartContext";

// A URL that matches no route at all lands here, outside the (site) group, so
// this file pulls in the storefront chrome and stylesheets itself.
import "@/styles/crimson/legacy.css";
import "@/styles/crimson/reveal.css";
import "@/styles/crimson/expose.css";

export default function RootNotFound() {
  return (
    <CartProvider>
      <SiteHeader />
      <main>
        <NotFoundContent />
      </main>
      <SiteFooter />
    </CartProvider>
  );
}
