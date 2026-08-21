import type { Metadata } from "next";
import TeamDetails from "@/components/template/team-details";

export const metadata: Metadata = { title: "Team Member — Crimson Deli" };

export default function Page() {
  return <TeamDetails />;
}
