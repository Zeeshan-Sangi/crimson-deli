"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Eased wheel scrolling across the storefront.
 *
 * The site this grew from had it through GSAP ScrollSmoother, and it went when
 * the template scripts were dropped. Lenis gives the same glide without a
 * wrapper around the page: it moves the real window scroll, so the sticky
 * header, the scroll reveals and Next's back-button scroll restoration all keep
 * working. Touch keeps the device's own scrolling, and anyone who has asked
 * their system for reduced motion gets none of this.
 */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.09,
      autoRaf: true,
      anchors: true,
      // Scrollable panels inside the page (the mobile menu) scroll themselves.
      allowNestedScroll: true,
    });
    lenis.current = instance;

    // The glide keeps easing for about a second after a flick. Pressing Back
    // inside that second let it drag the page to where the old page was heading
    // and undo the browser's scroll restoration, so any glide in flight stops
    // the moment history moves.
    const settle = () => instance.scrollTo(window.scrollY, { immediate: true, force: true });
    window.addEventListener("popstate", settle);

    return () => {
      window.removeEventListener("popstate", settle);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // A new page has a new height and a new scroll position (top, or wherever
  // Back restored it). Without this the first flick can start from, or stop
  // short at, the previous page's numbers.
  useEffect(() => {
    const instance = lenis.current;
    if (!instance) return;
    instance.resize();
    instance.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
