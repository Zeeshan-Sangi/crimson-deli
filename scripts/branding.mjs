/**
 * Real Crimson Deli details, applied to every generated template component.
 *
 * This lives in the conversion pipeline (not hand-edits on the .tsx files) so
 * that re-running `node scripts/convert-pages.mjs` never resurrects the
 * template's placeholder brand, phone numbers, emails or addresses.
 */

export const BRAND = "Crimson Deli";
export const PHONE_TEXT = "+1 (215) 718-7553";
export const PHONE_HREF = "tel:+12157187553";
export const EMAIL = "info@crimsondeli.com";
export const ADDRESS = "7720 Ogontz Avenue, Philadelphia, PA 19150";
export const CITY = "Philadelphia";
/** Keyless Google Maps embed pointed at the real address. */
export const MAP_SRC =
  "https://maps.google.com/maps?q=7720%20Ogontz%20Avenue%2C%20Philadelphia%2C%20PA%2019150&output=embed";

/** Every phone number the template ships, in both href and display form. */
const PHONE_HREFS = [
  "tel:+3930300002",
  "tel:2341096666",
  "tel:+17189044450",
  "tel:+435635333423",
  "tel:+12388544329520",
];
const PHONE_TEXTS = [
  "+393 030 0002",
  "(234) 109-6666",
  "+1 718-904 4450",
  "+1 718-904-4450",
  "+43 563 5333 423",
  "+(123) 8854-432-9520",
];
const EMAILS = ["yordomain@gmial.com", "support@foddies.org", "yourname@example.com"];
const ADDRESSES = [
  "4517 Washington Ave. Manch ester, Kentucky 39495",
  "575 Main Street, D-block, 2nd <br /> floor, South Africa",
];

/** Depth-matched cut of the element starting at `start` (which must be a `<tag` open). */
function cutTagBlock(src, start, tag) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, "g");
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === `</${tag}>`) {
      if (--depth === 0) return { start, end: m.index + m[0].length };
    } else {
      depth++;
    }
  }
  return null;
}

/**
 * contact.html advertises three fictional overseas offices (South Africa / USA /
 * German), each repeating the same dummy address. Crimson Deli has one location,
 * so keep a single centred card and drop the other two.
 */
function collapseOfficeCards(src) {
  const secStart = src.indexOf('<section className="contact-flag-section-in');
  if (secStart === -1) return src;
  const sec = cutTagBlock(src, secStart, "section");
  if (!sec) return src;

  let block = src.slice(sec.start, sec.end);
  const COL = '<div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"';
  // Drop every card after the first, last-to-first so earlier offsets stay valid.
  const starts = [];
  for (let i = block.indexOf(COL); i !== -1; i = block.indexOf(COL, i + 1)) starts.push(i);
  for (const s of starts.slice(1).reverse()) {
    const col = cutTagBlock(block, s, "div");
    if (col) block = block.slice(0, col.start) + block.slice(col.end);
  }
  block = block.replace('<div className="row g-4">', '<div className="row g-4 justify-content-center">');
  block = block.replace(/(<h2 className="title">\s*)South Africa(\s*<\/h2>)/, `$1${CITY}$2`);
  return src.slice(0, sec.start) + block + src.slice(sec.end);
}

export function applyBranding(src) {
  let out = src;

  for (const h of PHONE_HREFS) out = out.split(h).join(PHONE_HREF);
  for (const t of PHONE_TEXTS) out = out.split(t).join(PHONE_TEXT);
  for (const e of EMAILS) out = out.split(e).join(EMAIL);
  for (const a of ADDRESSES) out = out.split(a).join(ADDRESS);

  out = out.split("Foodies").join(BRAND);

  // Template mislabels the footer address with a search icon.
  out = out.replace(/fa-solid fa-magnifying-glass"><\/i>(\s*)7720 Ogontz/g, 'fa-solid fa-location-dot"></i>$1' + "7720 Ogontz");

  // Logo images ship with alt="img" / alt="logo-img".
  out = out.replace(
    /(<img src="\/assets\/img\/(?:logo\/logo|home-4\/footer-logo)\.png" alt=")(?:img|logo-img)(")/g,
    `$1${BRAND}$2`,
  );

  // Demo map embed (Envato's Melbourne office) → the real address.
  out = out.replace(/src="https:\/\/www\.google\.com\/maps\/embed\?[^"]*"/g, `src="${MAP_SRC}"`);

  out = collapseOfficeCards(out);
  return out;
}
