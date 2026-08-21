import type { Metadata } from "next";
import Contact from "@/components/template/contact";

export const metadata: Metadata = { title: "Contact — Crimson Deli" };

export default function Page() {
  return <Contact />;
}
