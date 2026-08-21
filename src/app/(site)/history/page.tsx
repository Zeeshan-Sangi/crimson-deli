import type { Metadata } from "next";
import History from "@/components/template/history";

export const metadata: Metadata = { title: "Our History — Crimson Deli" };

export default function Page() {
  return <History />;
}
