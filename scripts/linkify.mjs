/**
 * Phase 4: turn same-origin anchors into next/link so navigation is client-side.
 *
 * Only hrefs that start with "/" become <Link>. Everything else the template
 * uses — "#", "javascript:void(0)", tel: and mailto: — must stay a plain <a>,
 * because <Link> expects a real route and would break those.
 *
 * The template has no nested anchors (verified), so the first </a> after an
 * opening tag is always its match.
 */
const OPEN_TAG = /<a\s[^>]*>/g;

export function linkify(src) {
  let out = "";
  let last = 0;
  let count = 0;
  let m;

  OPEN_TAG.lastIndex = 0;
  while ((m = OPEN_TAG.exec(src))) {
    const tag = m[0];
    if (tag.endsWith("/>")) continue; // self-closing: no content, leave alone
    const href = /href="([^"]*)"/.exec(tag)?.[1];
    if (!href || !href.startsWith("/")) continue;

    const close = src.indexOf("</a>", OPEN_TAG.lastIndex);
    if (close === -1) continue;

    out += src.slice(last, m.index);
    out += `<Link${tag.slice(2, -1)}>`;
    out += src.slice(OPEN_TAG.lastIndex, close);
    out += "</Link>";
    last = close + "</a>".length;
    count += 1;
  }

  out += src.slice(last);
  return { code: out, count };
}

export const LINK_IMPORT = 'import Link from "next/link";';
