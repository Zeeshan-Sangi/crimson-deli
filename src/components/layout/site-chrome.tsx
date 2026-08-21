import BackToTop from "./back-to-top";
import Offcanvas from "./offcanvas";
import Preloader from "./preloader";

/** Preloader, back-to-top button, custom cursor and the offcanvas mobile panel. */
export default function SiteChrome() {
  return (
    <>
      <Preloader />
      <BackToTop />
      {/* Decorative cursor followers, still driven by the template's GSAP script. */}
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>
      <Offcanvas />
    </>
  );
}
