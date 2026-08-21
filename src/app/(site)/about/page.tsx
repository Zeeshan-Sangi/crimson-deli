import type { Metadata } from "next";
import About from "@/components/template/about";

export const metadata: Metadata = { title: "About Us — Crimson Deli" };

export default function Page() {
  return <About />;
}
