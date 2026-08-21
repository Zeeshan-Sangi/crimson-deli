import type { Metadata } from "next";
import Checkout from "@/components/template/checkout";

export const metadata: Metadata = { title: "Checkout — Crimson Deli" };

export default function Page() {
  return <Checkout />;
}
