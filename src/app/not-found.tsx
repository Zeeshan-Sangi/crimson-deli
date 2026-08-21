import type { Metadata } from "next";
import SiteShell from "@/components/layout/site-shell";
import Error404 from "@/components/template/error-404";

export const metadata: Metadata = { title: "Page Not Found — Crimson Deli" };

/** Next's handler for unmatched URLs; /404 renders the same content. */
export default function NotFound() {
  return (
    <SiteShell>
      <Error404 />
    </SiteShell>
  );
}
