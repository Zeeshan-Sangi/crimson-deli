import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * Crawl rules.
 *
 * The storefront is open. Everything behind a session, plus the pages that only
 * make sense mid-purchase, is closed — most importantly /order/, where the
 * tracking token in the URL is the only thing protecting an order's details.
 * An indexed tracking link would publish a customer's order.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/team",
          "/account",
          "/order/",
          "/cart",
          "/checkout",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
