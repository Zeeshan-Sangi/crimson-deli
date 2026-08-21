import type { Metadata } from "next";
import ShopList from "@/components/template/shop-list";

export const metadata: Metadata = { title: "Shop List — Crimson Deli" };

export default function Page() {
  return <ShopList />;
}
