/**
 * Real-browser smoke test (headless Chromium, local — nothing is published).
 *
 * Covers what HTTP checks and jsdom cannot: that the React chrome actually
 * works, that Swiper initialises, that client-side navigation does not reload
 * the page or leave the next page's sliders dead, and that no console errors
 * appear along the way.
 *
 * Usage: BASE=http://localhost:3111 node scripts/test/browser.test.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3111";

const fails = [];
const check = (label, ok, detail = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) fails.push(label);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

// Detect full page reloads: a value set on window survives client-side nav only.
async function markSession() {
  await page.evaluate(() => {
    window.__spaMarker = "alive";
  });
}
const stillSameDocument = () => page.evaluate(() => window.__spaMarker === "alive");

console.log(`\n=== home (${BASE}) ===`);
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

check("preloader is gone", (await page.locator(".preloader").count()) === 0);
check(
  "hero slider initialised",
  (await page.locator(".hero-slider.swiper-initialized").count()) > 0,
);
const heroSlides = await page.locator(".hero-slider .swiper-slide").count();
check("hero slider has slides", heroSlides > 0, `${heroSlides} slides`);
check("header rendered", (await page.locator("header.header-section-2").count()) === 1);

console.log("\n=== client-side navigation: Home -> Menu ===");
await markSession();
await page.locator('header nav#mobile-menu a[href="/menu"]').first().click();
await page.waitForURL("**/menu");
await page.waitForLoadState("networkidle");
check("navigated to /menu", page.url().endsWith("/menu"));
check("no full page reload (client-side routing)", await stillSameDocument());
check("scrolled to top after navigation", (await page.evaluate(() => window.scrollY)) < 50);

console.log("\n=== a page with sliders: /menu ===");
await markSession();
await page.goto(`${BASE}/menu`, { waitUntil: "networkidle" });
const inited = await page.locator(".swiper-initialized").count();
check("sliders initialised on this page", inited > 0, `${inited} swiper(s)`);

console.log("\n=== navigate again, sliders must still initialise ===");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await markSession();
await page.locator('header nav#mobile-menu a[href="/about"]').first().click();
await page.waitForURL("**/about");
await page.waitForLoadState("networkidle");
check("no full reload on 2nd navigation", await stillSameDocument());
const aboutSwipers = await page.locator(".swiper-initialized").count();
check("sliders initialised after client-side nav", aboutSwipers > 0, `${aboutSwipers} swiper(s)`);
check(
  "no duplicated mobile menus",
  (await page.locator(".mean-nav").count()) <= 1,
  `${await page.locator(".mean-nav").count()} .mean-nav`,
);

console.log("\n=== search box ===");
await page.fill('header input[name="q"]', "burger");
await page.press('header input[name="q"]', "Enter");
await page.waitForURL("**/shop?q=burger");
await page.waitForLoadState("networkidle");
const cards = await page.locator(".food-category-items-4").count();
check("search returned results", cards > 0, `${cards} cards`);

console.log("\n=== mobile menu (390x844) ===");
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
await mobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
await mobile.locator(".sidebar__toggle").click();
await mobile.waitForTimeout(400);
check("offcanvas opens", (await mobile.locator(".offcanvas__info.info-open").count()) === 1);
check("mobile nav rendered", (await mobile.locator(".mean-nav a").count()) > 0);
await mobile.locator(".offcanvas__close button").click();
await mobile.waitForTimeout(400);
check("offcanvas closes", (await mobile.locator(".offcanvas__info.info-open").count()) === 0);

console.log("\n=== console errors ===");
const noise = errors.filter((e) => !/favicon|404 \(Not Found\)/i.test(e));
check("no console/page errors", noise.length === 0, noise.slice(0, 5).join(" | "));

await browser.close();
console.log(`\n${fails.length === 0 ? "PASS — browser behaviour verified" : `FAILED: ${fails.join(", ")}`}`);
process.exit(fails.length === 0 ? 0 : 1);
