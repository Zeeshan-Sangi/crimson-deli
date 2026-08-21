import type { Metadata } from "next";
import Menu from "@/components/template/menu";

export const metadata: Metadata = { title: "Menu — Crimson Deli" };

export default function Page() {
  return <Menu />;
}
