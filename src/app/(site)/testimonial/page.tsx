import type { Metadata } from "next";
import Testimonial from "@/components/template/testimonial";

export const metadata: Metadata = { title: "Testimonials — Crimson Deli" };

export default function Page() {
  return <Testimonial />;
}
