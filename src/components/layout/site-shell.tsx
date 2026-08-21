import ScrollReveal from "./scroll-reveal";
import SiteChrome from "./site-chrome";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import { OffcanvasProvider } from "./offcanvas-context";

/**
 * The markup every page shares. #smooth-wrapper/#smooth-content must stay in
 * this exact nesting — GSAP ScrollSmoother targets them by id.
 *
 * OffcanvasProvider wraps both the header (which owns the hamburger) and the
 * chrome (which owns the slide-in panel) so they share one piece of state.
 */
export default function SiteShell({
  children,
  footerPadding,
}: {
  children: React.ReactNode;
  footerPadding?: string;
}) {
  return (
    <OffcanvasProvider>
      <ScrollReveal />
      <div className="page-wrapper">
        <SiteChrome />
        <SiteHeader />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
            <SiteFooter paddingClass={footerPadding} />
          </div>
        </div>
      </div>
    </OffcanvasProvider>
  );
}
