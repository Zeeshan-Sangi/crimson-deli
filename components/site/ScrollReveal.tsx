"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal for the storefront, replacing the old wow.js + waypoints pair.
 *
 * Markup marks a revealing element with `wow fadeInUp` / `data-wow-delay`, so
 * this scans for `.wow` elements and plays the animate.css animation once each
 * scrolls into view — no jQuery.
 *
 * Honours `prefers-reduced-motion`: reduced-motion users get the content
 * immediately, fully visible, with no observer attached at all.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".wow"));
    if (nodes.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((el) => {
        el.style.visibility = "visible";
      });
      return;
    }

    // wow.js hid elements inline until they entered the viewport; match that so
    // the reveal has something to reveal.
    nodes.forEach((el) => {
      if (el.dataset.revealed !== "true") el.style.visibility = "hidden";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.wowDelay;
          if (delay) el.style.animationDelay = delay;
          el.style.visibility = "visible";
          el.classList.add("animated");
          el.dataset.revealed = "true";
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
