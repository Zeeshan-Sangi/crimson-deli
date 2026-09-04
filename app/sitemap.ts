import type { MetadataRoute } from "next";
import { convenienceCategories } from "@/lib/data/convenience";
import { listAvailableProducts } from "@/lib/products/store";
import { absoluteUrl } from "@/lib/seo";

// Product pages come from Firestore, so this is built per request rather than
// baked in at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Entry = MetadataRoute.Sitemap[number];

const STATIC: Array<{ path: string; priority: number; changeFrequency: Entry["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/food", priority: 0.9, changeFrequency: "daily" },
  { path: "/store", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: absoluteUrl(s.path),
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  for (const category of convenienceCategories) {
    entries.push({
      url: absoluteUrl(`/store/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // A missing database must not take the whole sitemap down with it — the
  // static routes above are still worth serving.
  try {
    const products = await listAvailableProducts();
    for (const product of products) {
      entries.push({
        url: absoluteUrl(`/food/${product.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (err) {
    console.error("[sitemap] could not list products", err);
  }

  return entries;
}
