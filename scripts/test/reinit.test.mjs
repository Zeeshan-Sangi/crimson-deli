/**
 * Verifies that main.patched.js is safe to call repeatedly, which is what
 * app/template.tsx does after every client-side navigation.
 *
 * Runs the real jQuery against a jsdom DOM shaped like the site (persistent
 * layout chrome + swappable page content), stubs the plugins main.js calls, and
 * asserts that a second __templateReady() re-initialises page content without
 * duplicating the singletons that live in the layout.
 *
 * Usage: node scripts/test/reinit.test.mjs
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const LAYOUT = `
  <div class="page-wrapper">
    <div class="preloader"><div class="loader"></div></div>
    <button id="back-top" class="back-to-top"></button>
    <div class="mobile-menu"></div>
    <header class="header-section-2">
      <nav id="mobile-menu"><ul><li><a href="/">Home</a></li></ul></nav>
      <select class="single-select"><option>EN</option></select>
      <div class="sidebar-header"></div>
    </header>
    <div id="smooth-wrapper"><div id="smooth-content"><div id="page"></div></div></div>
  </div>`;

const PAGE_A = `<div class="swiper testimonial-slider"></div><div class="wow"></div><a class="img-popup" href="#"></a>`;
const PAGE_B = `<div class="swiper hero-slider"></div><div class="wow"></div><div class="counter"></div>`;

const dom = new JSDOM(`<!doctype html><html><body>${LAYOUT}</body></html>`, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "http://localhost/",
});
const { window } = dom;

// Real jQuery, so event namespacing behaves exactly as it will in the browser.
window.eval(readFileSync("public/assets/js/jquery-3.7.1.min.js", "utf8"));
const $ = window.jQuery;

// Count plugin invocations so we can tell "ran again" from "ran twice on the same node".
const calls = { meanmenu: 0, niceSelect: 0, swiper: 0, wow: 0, magnificPopup: 0, smoother: 0 };

$.fn.meanmenu = function () { calls.meanmenu++; $(".mobile-menu").append('<div class="mean-nav"></div>'); return this; };
$.fn.niceSelect = function () { calls.niceSelect++; return this.each(function () { $(this).after('<div class="nice-select"></div>'); }); };
$.fn.magnificPopup = function () { calls.magnificPopup++; return this; };
$.fn.counterUp = function () { return this; };
$.fn.waypoint = function () { return this; };
$.fn.imagesLoaded = function () { return this; };

class Swiper { constructor() { calls.swiper++; } }
window.Swiper = Swiper;
class WOW { init() { calls.wow++; } stop() {} sync() {} }
window.WOW = WOW;

let smootherInstance = null;
window.ScrollSmoother = {
  create() { calls.smoother++; smootherInstance = {}; return smootherInstance; },
  get() { return smootherInstance; },
};
window.ScrollTrigger = { create() {}, refresh() {}, matchMedia() {} };
window.SplitText = class { constructor() { this.lines = []; this.words = []; this.chars = []; } };
const noopChain = () => new Proxy(() => noopChain(), { get: () => noopChain(), apply: () => noopChain() });
window.gsap = new Proxy({}, { get: () => noopChain() });
window.Chroma = window.chroma = () => ({ hex: () => "#000" });

// MAIN_JS lets this run against the unpatched file as a negative control.
const MAIN_JS = process.env.MAIN_JS || "public/assets/js/main.patched.js";
window.eval(readFileSync(MAIN_JS, "utf8"));
console.log(`testing ${MAIN_JS}\n`);

const fail = [];
const check = (label, actual, expected) => {
  const ok = actual === expected;
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${label}: ${actual} (expected ${expected})`);
  if (!ok) fail.push(label);
};

// --- first load -----------------------------------------------------------
// jQuery defers its ready queue via window.setTimeout — wait on jsdom's timer
// (not Node's, which runs on a different queue) until main.js has actually run.
for (let i = 0; i < 50 && !window.__templateHasRun; i++) {
  await new Promise((r) => window.setTimeout(r, 10));
}
console.log("after first load:");
check("__templateReady exposed", typeof window.__templateReady, "function");
check("__templateHasRun", window.__templateHasRun, true);
check("meanmenu NOT called (React owns it)", calls.meanmenu, 0);
check("nice-select NOT called (React owns it)", calls.niceSelect, 0);
check("ScrollSmoother created", calls.smoother, 1);
check("Swiper NOT built by main.js (React owns sliders)", calls.swiper, 0);

// --- simulate a client-side navigation ------------------------------------
$("#page").html(PAGE_A);
window.__templateReady();
console.log("\nafter navigation #1:");
check("meanmenu still not called", calls.meanmenu, 0);
check("nice-select still not called", calls.niceSelect, 0);
check(".nice-select nodes", $(".nice-select").length, 0);
check(".mean-nav nodes", $(".mean-nav").length, 0);
check("ScrollSmoother NOT recreated", calls.smoother, 1);
check("still no jQuery Swiper on navigation", calls.swiper, 0);

// --- and again ------------------------------------------------------------
$("#page").html(PAGE_B);
window.__templateReady();
console.log("\nafter navigation #2:");
check("meanmenu still not called", calls.meanmenu, 0);
check(".nice-select still absent", $(".nice-select").length, 0);
check("ScrollSmoother still single", calls.smoother, 1);

// Global handlers must not stack. Assert stability rather than a magic number:
// whatever one run binds, three runs must still have exactly that many.
const countHandlers = () => {
  const d = $._data(window.document, "events") || {};
  const w = $._data(window, "events") || {};
  return { click: (d.click || []).length, scroll: (w.scroll || []).length };
};
const after3 = countHandlers();
window.__templateReady();
const after4 = countHandlers();
check("document click handlers stable", after4.click, after3.click);
check("window scroll handlers stable", after4.scroll, after3.scroll);
console.log(`         (bound per run: ${after3.click} click, ${after3.scroll} scroll — unchanged across 4 runs)`);

console.log(`\n${fail.length === 0 ? "PASS — re-init is idempotent" : `FAILED: ${fail.join(", ")}`}`);
process.exit(fail.length === 0 ? 0 : 1);
