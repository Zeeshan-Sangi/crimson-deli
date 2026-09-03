import Link from "next/link";
import Breadcrumb from "@/components/site/Breadcrumb";
import LegalToc from "@/components/site/LegalToc";
import { siteConfig } from "@/lib/site-config";

/**
 * Shared shell for the two policy documents.
 *
 * They are data, not markup, so the privacy policy and the terms cannot drift
 * into looking like two different companies wrote them, and so the contents
 * list is generated from the sections rather than maintained by hand beside
 * them — a table of contents that disagrees with the document is worse than
 * none at all.
 */
export type LegalSection = {
  /** Anchor id; also what the contents list links to. */
  id: string;
  heading: string;
  /** Paragraphs and lists, in order. */
  body: Array<string | { list: string[] }>;
};

function longDate(iso: string): string {
  const t = Date.parse(iso);
  return Number.isNaN(t)
    ? iso
    : new Date(t).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function LegalDoc({
  title,
  effective,
  intro,
  sections,
}: {
  title: string;
  /** ISO date this version took effect. */
  effective: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Breadcrumb title={title} trail={[{ label: title }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap cd-legal">
          <aside className="cd-legal__toc" aria-label="Contents">
            <h2>Contents</h2>
            <LegalToc
              sections={sections.map((s) => ({ id: s.id, heading: s.heading }))}
            />
            <p className="cd-legal__toc-foot">
              Questions? <Link href="/contact">Contact us</Link> or call{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
            </p>
          </aside>

          <article className="cd-legal__body">
            <p className="cd-legal__effective">
              <strong>Effective:</strong>{" "}
              <time dateTime={effective}>{longDate(effective)}</time>
            </p>
            <p className="cd-legal__intro">{intro}</p>

            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="cd-legal__section">
                <h2>
                  <span className="cd-legal__num">{i + 1}.</span> {section.heading}
                </h2>
                {section.body.map((block, j) =>
                  typeof block === "string" ? (
                    <p key={j}>{block}</p>
                  ) : (
                    <ul key={j}>
                      {block.list.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
