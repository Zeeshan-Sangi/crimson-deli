import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollReveal from "@/components/site/ScrollReveal";
import { CartProvider } from "@/lib/cart/CartContext";

// Legacy page styles — being replaced section by section (Phase 2+).
import "@/styles/crimson/legacy.css";
import "@/styles/crimson/reveal.css";
import "@/styles/crimson/expose.css";
import "@/styles/crimson/site-chrome.css";
import "@/styles/crimson/site-pages.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="cd-site">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
      <ScrollReveal />
    </CartProvider>
  );
}
