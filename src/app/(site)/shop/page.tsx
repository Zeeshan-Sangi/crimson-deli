import type { Metadata } from "next";
import Shop from "@/components/template/shop";
import SearchResults from "@/components/shop/search-results";

export const metadata: Metadata = { title: "Shop — Crimson Deli" };

/** Hand-written (not generated): serves search results when ?q= is present. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  return query ? <SearchResults query={query} /> : <Shop />;
}
