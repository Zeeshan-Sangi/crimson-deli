import type { Metadata } from "next";
import ShopGridSidebar from "@/components/template/shop-grid-sidebar";

export const metadata: Metadata = { title: "Shop Grid — Crimson Deli" };

export default function Page() {
  return <ShopGridSidebar />;
}
