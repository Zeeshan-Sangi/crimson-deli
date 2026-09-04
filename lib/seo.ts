import { siteConfig } from "@/lib/site-config";
import { DAYS, type Day, type DayHours } from "@/lib/settings/types";

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

/** Schema.org WebSite — tells search engines the site's canonical name. */
export function websiteJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: site,
  };
}

const SCHEMA_DAY: Record<Day, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/**
 * Schema.org LocalBusiness for the storefront.
 *
 * This is the one that matters most for a neighborhood store: it is what feeds
 * the name, address, phone and opening hours into local search and maps. Hours
 * come from store settings rather than being restated here, so editing them in
 * the admin panel updates what search engines are told.
 */
export function localBusinessJsonLd(hours: Record<Day, DayHours>) {
  const site = getSiteUrl();
  const openingHoursSpecification = DAYS.filter((day) => !hours[day].closed).map(
    (day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAY[day]}`,
      opens: hours[day].open,
      closes: hours[day].close,
    }),
  );

  // Blank entries mean "no account yet" — an empty string in sameAs is worse
  // than no sameAs at all.
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "GroceryStore"],
    "@id": `${site}/#store`,
    name: siteConfig.name,
    url: site,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: absoluteUrl("/opengraph-image.png"),
    priceRange: "$",
    servesCuisine: ["Deli", "Sandwiches", "Smoothies"],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.street,
      addressLocality: "Philadelphia",
      addressRegion: "PA",
      postalCode: "19150",
      addressCountry: "US",
    },
    openingHoursSpecification,
    ...(sameAs.length ? { sameAs } : {}),
    hasMenu: absoluteUrl("/food"),
    // Pickup only for fresh food — the site says so everywhere else, so the
    // structured data must not imply delivery.
    hasDeliveryMethod: "https://schema.org/PickUp",
    potentialAction: {
      "@type": "OrderAction",
      target: absoluteUrl("/food"),
      deliveryMethod: "https://schema.org/PickUp",
    },
  };
}

/**
 * Schema.org Product for a menu item.
 *
 * `seller` points at the LocalBusiness node the home page emits, so search
 * engines tie the item to the store rather than treating it as a loose product.
 * An item with no price yet gets no `offers` block at all — an offer without a
 * price is invalid, and inventing one would be worse than omitting it.
 */
export function menuItemJsonLd(item: {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  available: boolean;
}) {
  const site = getSiteUrl();
  const url = absoluteUrl(`/food/${item.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: absoluteUrl(item.imageUrl),
    url,
    ...(item.priceCents !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: (item.priceCents / 100).toFixed(2),
            priceCurrency: "USD",
            availability: item.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            availableDeliveryMethod: "https://schema.org/PickUp",
            seller: { "@id": `${site}/#store` },
          },
        }
      : {}),
  };
}
