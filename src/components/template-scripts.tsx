"use client";

import { useEffect } from "react";

// Removed as provably dead weight (~1.8MB, 66% of the template's JS):
//   three.js (1744KB) — only consumer was webgl.js
//   webgl.js          — targets #showcase-slider-holder / #canvas-slider / .slide-img,
//                       none of which exist in this site (it belonged to another demo)
//   chroma.min.js     — referenced by nothing
//   TextPlugin.js     — no gsap text tweens anywhere
// The files are still in public/assets/js if a future page ever needs them.
//
// Also removed once their targets were confirmed absent from the markup:
// ripple-2.js (.ripple-image), waypoints + counterup (.count), magnific-popup
// (.img-popup / .video-popup) and wow.min.js (replaced by ScrollReveal).
//
// meanmenu, nice-select and swiper are gone for good: React components now own
// the mobile menu, the location dropdown and every slider (swiper/react ships
// its own matching CSS and JS through the npm package).
const SCRIPTS = [
  "/assets/js/jquery-3.7.1.min.js",
  "/assets/js/bootstrap.bundle.min.js",
  "/assets/js/gsap.min.js",
  "/assets/js/ScrollTrigger.min.js",
  "/assets/js/ScrollSmoother.min.js",
  "/assets/js/ScrollToPlugin.min.js",
  "/assets/js/SplitText.min.js",
  "/assets/js/main.patched.js",
];

function loadScript(src: string, type?: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-template="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.template = src;
    if (type) el.type = type;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed: ${src}`));
    document.body.appendChild(el);
  });
}

/**
 * Loads the template's jQuery plugin stack once, in order, after mount.
 *
 * Order matters (every plugin needs jQuery/GSAP first) and `async = false` on an
 * injected script preserves it, so this stays a manual loader rather than
 * next/script: `beforeInteractive` would put ~2.7MB of vendor JS in the critical
 * path, and `afterInteractive` renders <script async> with no ordering guarantee.
 *
 * main.patched.js exposes window.__templateReady() so app/template.tsx can
 * re-initialise the per-page plugins after client-side navigation.
 */
export default function TemplateScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const src of SCRIPTS) {
          if (cancelled) return;
          await loadScript(src);
        }
        if (!cancelled) {
          await loadScript("/assets/js/distortion-img.js", "module");
        }
      } catch (e) {
        console.warn("[TemplateScripts]", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
