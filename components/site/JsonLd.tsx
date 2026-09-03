import {
  absoluteUrl,
  breadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/lib/seo";

/** Invisible JSON-LD script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** BreadcrumbList schema for a page trail (Home → … → current). */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const trail: BreadcrumbItem[] =
    items[0]?.path === "/" ? items : [{ name: "Home", path: "/" }, ...items];
  return <JsonLd data={breadcrumbJsonLd(trail)} />;
}

export { absoluteUrl };
