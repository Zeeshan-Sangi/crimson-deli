import type { Metadata } from "next";
import ShopListSidebar from "@/components/template/shop-list-sidebar";

export const metadata: Metadata = { title: "Shop List Sidebar — Crimson Deli" };

export default function Page() {
  return <ShopListSidebar />;
}
