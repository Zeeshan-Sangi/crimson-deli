import type { Metadata } from "next";
import Reservation from "@/components/template/reservation";

export const metadata: Metadata = { title: "Reservation — Crimson Deli" };

export default function Page() {
  return <Reservation />;
}
