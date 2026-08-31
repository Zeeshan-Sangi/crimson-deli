import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({
  title,
  trail = [],
}: {
  title: string;
  trail?: Crumb[];
}) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...trail];

  return (
    <section className="cd-breadcrumb">
      <h1>{title}</h1>
      <ul className="cd-breadcrumb__trail">
        {crumbs.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && (
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
            )}
            <li>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</li>
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
