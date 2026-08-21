/**
 * Convert every _template/*.html page into a TSX component + App Router page,
 * and hoist the shared chrome (header / footer / preloader / offcanvas) into
 * layout components so it is not duplicated 20 times.
 * Usage: node scripts/convert-pages.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { applyBranding } from "./branding.mjs";
import { IMAGE_IMPORT, backgroundify, imagify } from "./imagify.mjs";
import { LINK_IMPORT, linkify } from "./linkify.mjs";
import { NICE_SELECT_IMPORT, selectify } from "./selectify.mjs";
import { SLIDER_IMPORT, sliderify } from "./sliderify.mjs";
import { extractContent, renderPageComponent } from "./extract-chrome.mjs";

/** html basename -> [component file stem, export name, route segment] */
export const PAGES = [
  ["index-4", "home-4", "Home4", ""],
  ["404", "error-404", "Error404", "404"],
  ["about", "about", "About", "about"],
  ["checkout", "checkout", "Checkout", "checkout"],
  ["contact", "contact", "Contact", "contact"],
  ["faq", "faq", "Faq", "faq"],
  ["gallery", "gallery", "Gallery", "gallery"],
  ["history", "history", "History", "history"],
  ["menu", "menu", "Menu", "menu"],
  ["reservation", "reservation", "Reservation", "reservation"],
  ["shop", "shop", "Shop", "shop"],
  ["shop-cart", "shop-cart", "ShopCart", "shop-cart"],
  ["shop-details", "shop-details", "ShopDetails", "shop-details"],
  ["shop-grid-sidebar", "shop-grid-sidebar", "ShopGridSidebar", "shop-grid-sidebar"],
  ["shop-list", "shop-list", "ShopList", "shop-list"],
  ["shop-list-sidebar", "shop-list-sidebar", "ShopListSidebar", "shop-list-sidebar"],
  ["team", "team", "Team", "team"],
  ["team-details", "team-details", "TeamDetails", "team-details"],
  ["testimonial", "testimonial", "Testimonial", "testimonial"],
  ["wishlist", "wishlist", "Wishlist", "wishlist"],
];

const TITLES = {
  "index-4": null, // root layout already titles the site
  "404": "Page Not Found",
  about: "About Us",
  checkout: "Checkout",
  contact: "Contact",
  faq: "FAQ",
  gallery: "Gallery",
  history: "Our History",
  menu: "Menu",
  reservation: "Reservation",
  shop: "Shop",
  "shop-cart": "Cart",
  "shop-details": "Product Details",
  "shop-grid-sidebar": "Shop Grid",
  "shop-list": "Shop List",
  "shop-list-sidebar": "Shop List Sidebar",
  team: "Our Team",
  "team-details": "Team Member",
  testimonial: "Testimonials",
  wishlist: "Wishlist",
};

/**
 * The template ships a "Home" mega-menu advertising 8 demo homepages
 * (index.html .. index-8.html) plus a mobile mirror of the same list.
 * We keep only index-4 as `/`, so both blocks are replaced with a plain Home link.
 * Depth-matched on <li>/</li> because the blocks are deeply nested.
 */
function cutLiBlock(src, openMarker) {
  const start = src.indexOf(openMarker);
  if (start === -1) return null;
  const re = /<li\b|<\/li>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === "</li>") {
      if (--depth === 0) return { start, end: m.index + m[0].length };
    } else {
      depth++;
    }
  }
  return null;
}

const HOME_LINK = '<li className="active">\n<a href="/">Home</a>\n</li>';

function collapseHomeMenu(src, file) {
  let out = src;
  // Mobile mirror first (removed outright), then the desktop thumbnail grid.
  const mobile = cutLiBlock(out, '<li className="has-dropdown active d-xl-none">');
  if (mobile) out = out.slice(0, mobile.start) + out.slice(mobile.end);
  const desktop = cutLiBlock(out, '<li className="has-dropdown active menu-thumb">');
  if (desktop) out = out.slice(0, desktop.start) + HOME_LINK + out.slice(desktop.end);
  if (!mobile && !desktop) console.warn(`  !! no home mega-menu found in ${file}`);
  return out;
}

/**
 * The template's nav carries a Blog dropdown (news-grid / news / news-details).
 * We are not shipping blog pages, so the whole dropdown item is dropped rather
 * than left pointing at routes that do not exist.
 */
function removeBlogMenu(src) {
  return src.replace(
    /[ \t]*<li>\s*<a href="javascript:void\(0\)">\s*Blog\s*<i className="fa-solid fa-chevron-down"><\/i>\s*<\/a>\s*<ul className="submenu">\s*(?:<li><a href="\/news[a-z-]*">[^<]*<\/a><\/li>\s*)+<\/ul>\s*<\/li>\n?/g,
    "",
  );
}

/**
 * Several pages carry a blog teaser section ("Our Blog & News") whose cards link
 * to /news-details. No blog pages are shipped, so the whole section goes.
 * Covers both markup variants the template uses: news-section-two and news-section-3.
 */
function removeNewsSection(src) {
  return src.replace(
    /[ \t]*\{\/\*\s*News[- ]Section Start\s*\*\/\}\s*<section className="news-section-[^"]*"[\s\S]*?<\/section>\n?/g,
    "",
  );
}

/**
 * The template posts the contact form to contact.php. Swap the whole block for
 * the React component that submits through a Server Action instead.
 */
function replaceContactForm(content) {
  const re = /[ \t]*<form action="contact\.php"[\s\S]*?<\/form>/;
  if (!re.test(content)) return { content, imports: [] };
  return {
    content: content.replace(re, "                        <ContactForm />"),
    imports: ['import ContactForm from "@/components/contact-form";'],
  };
}

/** Home keeps the template's tighter footer padding; inner pages need more room. */
const FOOTER_PADDING = { "index-4": "footer-fix-padding-4" };

// Old flat route dirs are replaced by the (site) group. Home stays at src/app/page.tsx:
// a root page.tsx must exist, otherwise the root not-found.tsx makes the build
// look for a Pages-Router /_error that does not exist.
for (const [, , , route] of PAGES) {
  if (route) rmSync(`src/app/${route}`, { recursive: true, force: true });
}
rmSync("src/app/(home)", { recursive: true, force: true });

const full = new Map();

for (const [html, stem, exportName] of PAGES) {
  const src = `_template/${html}.html`;
  const tmp = `src/components/template/${stem}.tsx`;
  execFileSync("node", ["scripts/html2jsx.mjs", src, tmp, exportName], { stdio: "inherit" });

  let code = readFileSync(tmp, "utf8");
  code = collapseHomeMenu(code, tmp);
  code = removeBlogMenu(code);
  code = removeNewsSection(code);
  code = applyBranding(code);
  full.set(html, code);
}

// Everything in src/components/layout is now hand-written React (real state,
// no jQuery). NOTHING there may be regenerated — doing so silently destroys
// hand-written work, which is exactly what happened to the footer once.
console.log("layout components are hand-written; nothing regenerated there");

let linkTotal = 0;
let imgTotal = 0;
let imgSkipped = 0;
let bgTotal = 0;
let selTotal = 0;
let sliderTotal = 0;

/** Routes whose page.tsx is hand-written (real data/state) — generate the
 *  template component for them, but never overwrite the route file. */
const CUSTOM_ROUTES = new Set(["shop"]);
const dimCache = new Map();

for (const [html, stem, exportName, route] of PAGES) {
  const component = `src/components/template/${stem}.tsx`;
  const { content, imports } = replaceContactForm(extractContent(full.get(html)));
  const { code: linked, count } = linkify(content);
  const { code: imaged, count: imgCount, skipped } = imagify(linked, dimCache);
  const { code: bgd, count: bgCount } = backgroundify(imaged);
  const { code: selected, count: selCount } = selectify(bgd);
  const { code, count: sliderCount } = sliderify(selected);
  if (sliderCount) imports.unshift(SLIDER_IMPORT);
  if (selCount) imports.unshift(NICE_SELECT_IMPORT);
  sliderTotal += sliderCount;
  bgTotal += bgCount;
  selTotal += selCount;
  if (imgCount) imports.unshift(IMAGE_IMPORT);
  if (count) imports.unshift(LINK_IMPORT);
  linkTotal += count;
  imgTotal += imgCount;
  imgSkipped += skipped;
  writeFileSync(
    component,
    renderPageComponent(stem, exportName, code, `_template/${html}.html`, imports),
  );

  const dir = route ? `src/app/(site)/${route}` : "src/app";
  mkdirSync(dir, { recursive: true });
  const title = TITLES[html];
  const pad = FOOTER_PADDING[html];

  // Home has no (site) layout above it, so it renders the shell itself.
  const body = route
    ? `export default function Page() {\n  return <${exportName} />;\n}\n`
    : `export default function Page() {\n  return (\n    <SiteShell${pad ? ` footerPadding="${pad}"` : ""}>\n      <${exportName} />\n    </SiteShell>\n  );\n}\n`;

  if (CUSTOM_ROUTES.has(route)) {
    console.log(`  ${component} -> ${dir}/page.tsx (hand-written, left alone)`);
    continue;
  }

  writeFileSync(
    `${dir}/page.tsx`,
    (title ? `import type { Metadata } from "next";\n` : "") +
      (route ? "" : `import SiteShell from "@/components/layout/site-shell";\n`) +
      `import ${exportName} from "@/components/template/${stem}";\n\n` +
      (title ? `export const metadata: Metadata = { title: "${title} — Crimson Deli" };\n\n` : "") +
      body,
  );
  console.log(`  ${component} -> ${dir}/page.tsx`);
}

// One thin layout wraps the 19 inner pages in the shared shell.
mkdirSync("src/app/(site)", { recursive: true });
writeFileSync(
  "src/app/(site)/layout.tsx",
  `import SiteShell from "@/components/layout/site-shell";\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <SiteShell>{children}</SiteShell>;\n}\n`,
);
console.log("wrote src/app/(site)/layout.tsx");
console.log(`linkified ${linkTotal} internal anchors in page components`);
console.log(`converted ${imgTotal} <img> to next/image (${imgSkipped} skipped: no readable dimensions)`);
console.log(`routed ${bgTotal} data-background images through the optimizer`);
console.log(`replaced ${selTotal} <select> with the React NiceSelect component`);
console.log(`replaced ${sliderTotal} Swiper blocks with the React Slider component`);
