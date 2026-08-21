import type { Metadata } from "next";
import ShopDetails from "@/components/template/shop-details";

export const metadata: Metadata = { title: "Product Details — Crimson Deli" };

export default function Page() {
  return <ShopDetails />;
}
