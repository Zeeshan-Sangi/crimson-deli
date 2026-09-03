/**
 * SEO helpers — absolute URLs and the JSON-LD shapes the storefront emits.
 *
 * Mirrors the same helpers in the 3R Blocks project so both sites describe
 * themselves to search engines the same way.
 */

/** Deployment origin, no trailing slash. Falls back to localhost in dev. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (configured || "http://localhost:3000").replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type BreadcrumbItem = { name: string; path: string };

/** Schema.org BreadcrumbList */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? site : absoluteUrl(item.path),
    })),
  };
}

export type FaqEntry = { q: string; a: string };

/**
 * Schema.org FAQPage.
 *
 * Answers must be plain text — which is why the FAQ data keeps them as strings
 * rather than JSX. Markup here would be rejected by the rich-result parser.
 */
export function faqJsonLd(path: string, entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(path),
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}
