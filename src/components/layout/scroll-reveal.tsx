"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * React replacement for wow.min.js.
 *
 * The template marks elements with `wow <animate.css name>` plus an optional
 * data-wow-delay, and WOW added the `animated` class once they scrolled into
 * view. An IntersectionObserver does the same in ~40 lines, and re-runs on
 * navigation so content rendered by client-side routing still animates.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".wow:not(.animated)"));
    if (targets.length === 0) return;

    // Respect users who asked for less motion: show everything, animate nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => {
        el.style.visibility = "visible";
      });
      return;
    }

    targets.forEach((el) => {
      el.style.visibility = "hidden";
    });

    const reveal = (el: HTMLElement) => {
      const delay = el.dataset.wowDelay;
      if (delay) el.style.animationDelay = delay;
      el.style.visibility = "visible";
      el.classList.add("animated");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
