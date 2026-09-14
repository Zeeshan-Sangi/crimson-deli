import { convenienceCategories } from "@/lib/data/convenience";
import { foodCategories } from "@/lib/data/food-menu";
import { listAvailableProducts } from "@/lib/products/store";
import { absoluteUrl } from "@/lib/seo";
import { formatHoursLine } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { siteConfig } from "@/lib/site-config";

/**
 * /llms.txt — the llmstxt.org convention: a short, link-rich Markdown summary
 * an assistant can read instead of scraping the whole site.
 *
 * Generated rather than checked in, so the menu and opening hours it states are
 * the live ones. The two facts most often got wrong about this store are that
 * fresh food is pickup-only and that payment happens at the counter, so both
 * are stated plainly near the top.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  let hoursLine = "See the contact page";
  let menuLines: string[] = [];

  try {
    const [{ store }, products] = await Promise.all([
      getSettings(),
      listAvailableProducts(),
    ]);
    hoursLine = formatHoursLine(store.hours);

    menuLines = foodCategories.flatMap((category) => {
      const items = products.filter((p) => p.categorySlug === category.slug);
      if (items.length === 0) return [];
      return [
        "",
        `### ${category.name}`,
        "",
        ...items.map(
          (item) =>
            `- [${item.name}](${absoluteUrl(`/food/${item.slug}`)})` +
            (item.priceCents === null
              ? ": priced at store"
              : `: $${(item.priceCents / 100).toFixed(2)}`),
        ),
      ];
    });
  } catch (err) {
    console.error("[llms.txt] could not read live data", err);
  }

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> A neighborhood deli and convenience store at ${siteConfig.address}. Fresh food is made in-store and is **pickup only**, so we do not deliver it. Everyday essentials are sold in-store or delivered through DoorDash. Payment for pickup orders is taken **at the counter**; the website never asks for card details.`,
    "",
    `- Phone: ${siteConfig.phone}`,
    `- Email: ${siteConfig.email}`,
    `- Address: ${siteConfig.address}`,
    `- Opening hours: ${hoursLine}`,
    "",
    "## Ordering",
    "",
    `- [Fresh food menu](${absoluteUrl("/food")}): order for pickup; an account is required`,
    `- [Cart](${absoluteUrl("/cart")}) and [checkout](${absoluteUrl("/checkout")}): pickup orders, paid at the store`,
    `- [Everyday essentials](${absoluteUrl("/store")}): in-store, or delivered via [DoorDash](${siteConfig.doordashUrl})`,
    "",
    "## Information",
    "",
    `- [About](${absoluteUrl("/about")}): what the store is and how the two lanes work`,
    `- [FAQ](${absoluteUrl("/faq")}): ordering, payment, allergens, DoorDash, account help`,
    `- [Contact](${absoluteUrl("/contact")}): phone, address, directions and a message form`,
    `- [Terms & Conditions](${absoluteUrl("/terms")}): includes the allergen statement`,
    `- [Privacy Policy](${absoluteUrl("/privacy")})`,
    "",
    "## Departments",
    "",
    ...convenienceCategories.map(
      (c) => `- [${c.name}](${absoluteUrl(`/store/${c.slug}`)})`,
    ),
    ...(menuLines.length ? ["", "## Fresh food menu", ...menuLines] : []),
    "",
    "## Notes",
    "",
    "- Fresh food is prepared in one kitchen on shared equipment; we cannot guarantee any item is free of an allergen. Customers with an allergy should call the store before ordering.",
    "- Prices and availability change; the store's own figure at the counter is authoritative.",
    "- Order tracking links are private. Do not index, share or repeat them.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
