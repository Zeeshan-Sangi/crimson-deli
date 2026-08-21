/**
 * DevTools-style network + console trace for one page.
 * Usage: BASE=http://localhost:3111 node scripts/test/nettrace.mjs /testimonial
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3111";
const path = process.argv[2] || "/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const bad = [];
const byType = new Map();
page.on("response", (r) => {
  const t = r.request().resourceType();
  byType.set(t, (byType.get(t) ?? 0) + 1);
  if (r.status() >= 400) bad.push(`${r.status()} ${t} ${r.url()}`);
});
page.on("requestfailed", (r) => {
  const err = r.failure()?.errorText ?? "";
  if (!/ERR_ABORTED/.test(err)) bad.push(`FAILED ${r.resourceType()} ${r.url()} :: ${err}`);
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(5000);

console.log(`\n${path}`);
console.log("  requests by type:", [...byType].map(([k, v]) => `${k}=${v}`).join(" "));
console.log(`  non-OK responses: ${bad.length}`);
bad.slice(0, 12).forEach((b) => console.log("    " + b.slice(0, 150)));
console.log(`  console errors: ${errors.length}`);
errors.slice(0, 8).forEach((e) => console.log("    " + e.slice(0, 150)));

await browser.close();
process.exit(bad.length || errors.length ? 1 : 0);
