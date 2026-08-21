import type { Metadata } from "next";
import Faq from "@/components/template/faq";

export const metadata: Metadata = { title: "FAQ — Crimson Deli" };

export default function Page() {
  return <Faq />;
}
