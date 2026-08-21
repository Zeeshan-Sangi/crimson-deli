"use client";

import { useEffect } from "react";

type Smoother = { scrollTo: (target: number, smooth?: boolean) => void };

declare global {
  interface Window {
    __templateReady?: () => void;
    __templateHasRun?: boolean;
    ScrollSmoother?: { get?: () => Smoother | null | undefined };
  }
}

/**
 * A template re-renders (and remounts) on every navigation, unlike a layout.
 *
 * The template's jQuery plugins are initialised once by main.patched.js on first
 * load. Client-side navigation swaps the page content without remounting the
 * layout, so sliders, WOW animations, popups and counters in the new content
 * would never be initialised. Re-running __templateReady() fixes that; the
 * patched main.js is written to be safe to call repeatedly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On the very first load main.js has not run yet (it is injected after
    // mount) and initialises itself — only later navigations need a nudge.
    if (!window.__templateHasRun || !window.__templateReady) return;

    // GSAP ScrollSmoother owns the scroll position, so Next's own scroll reset
    // does not reach it. Jump to the top before re-measuring, not after, or
    // ScrollTrigger records positions for the previous page's scroll offset.
    window.ScrollSmoother?.get?.()?.scrollTo(0, false);
    window.__templateReady();
  }, []);

  return <>{children}</>;
}
