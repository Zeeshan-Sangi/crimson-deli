import type { Metadata } from "next";
import Team from "@/components/template/team";

export const metadata: Metadata = { title: "Our Team — Crimson Deli" };

export default function Page() {
  return <Team />;
}
