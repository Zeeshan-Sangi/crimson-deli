import SiteHeader from "@/components/site/SiteHeader";
import { getCurrentUser } from "@/lib/auth/current-user";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollReveal from "@/components/site/ScrollReveal";
import { CartProvider } from "@/lib/cart/CartContext";

import "@/styles/crimson/reveal.css";
import "@/styles/crimson/expose.css";
import "@/styles/crimson/site-chrome.css";
import "@/styles/crimson/site-pages.css";

// The header shows who is signed in, which means this layout reads the session
// and must therefore render per request rather than being cached.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  const user = session ? { name: session.name, role: session.role } : null;

  return (
    <CartProvider>
      <div className="cd-site">
        <SiteHeader user={user} />
        <main>{children}</main>
        <SiteFooter />
      </div>
      <ScrollReveal />
    </CartProvider>
  );
}
