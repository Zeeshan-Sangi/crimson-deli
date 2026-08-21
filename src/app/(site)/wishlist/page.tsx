import type { Metadata } from "next";
import Wishlist from "@/components/template/wishlist";

export const metadata: Metadata = { title: "Wishlist — Crimson Deli" };

export default function Page() {
  return <Wishlist />;
}
