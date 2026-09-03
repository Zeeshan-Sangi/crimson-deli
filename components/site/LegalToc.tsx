"use client";

import { useEffect, useState } from "react";

/**
 * Contents list that tracks where you are in the document.
 *
 * A long policy page is one continuous scroll, and a static list gives no clue
 * which part you are reading. The check watches the section headings rather
 * than whole sections: a section can be taller than the viewport, in which case
 * "is it visible" is true for two at once and the highlight flickers. The
 * heading nearest the top wins instead.
 */
export default function LegalToc({
  sections,
}: {
  sections: Array<{ id: string; heading: string }>;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    function pick() {
      // The last heading that has passed the top of the viewport, with slack
      // for the sticky header. Before the first one nothing is active — the
      // reader is still on the intro.
      //
      // The header height comes from the same --cd-header-h the sticky offset
      // uses, so the highlight cannot drift out of step with the layout.
      const shell = document.querySelector(".cd-site");
      const headerH = shell
        ? parseFloat(getComputedStyle(shell).getPropertyValue("--cd-header-h")) || 0
        : 0;
      const line = headerH + 38;
      let current: string | null = null;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id;
      }
      // At the very bottom the last section may never reach the line, so give
      // it to the last one rather than leaving the list dead.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = nodes[nodes.length - 1].id;
      }
      setActive(current);
    }

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [sections]);

  return (
    <ol>
      {sections.map((s) => (
        <li key={s.id} className={active === s.id ? "is-active" : undefined}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
          >
            {s.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}
