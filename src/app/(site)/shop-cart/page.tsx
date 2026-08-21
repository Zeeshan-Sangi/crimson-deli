import type { Metadata } from "next";
import ShopCart from "@/components/template/shop-cart";

export const metadata: Metadata = { title: "Cart — Crimson Deli" };

export default function Page() {
  return <ShopCart />;
}
