import type { Metadata } from "next";
import Error404 from "@/components/template/error-404";

export const metadata: Metadata = { title: "Page Not Found — Crimson Deli" };

export default function Page() {
  return <Error404 />;
}
