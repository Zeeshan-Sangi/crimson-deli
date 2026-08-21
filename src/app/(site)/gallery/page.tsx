import type { Metadata } from "next";
import Gallery from "@/components/template/gallery";

export const metadata: Metadata = { title: "Gallery — Crimson Deli" };

export default function Page() {
  return <Gallery />;
}
