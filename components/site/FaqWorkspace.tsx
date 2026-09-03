"use client";

import { useEffect, useId, useState } from "react";

/**
 * Category rail plus one open answer at a time.
 *
 * Answers are plain strings rather than markup because the same data feeds the
 * FAQPage JSON-LD on the page — a rich-result parser wants text, not elements.
 */
export type FaqItem = { q: string; a: string };
export type FaqCategory = {
  id: string;
  title: string;
  blurb: string;
  items: FaqItem[];
};

export default function FaqWorkspace({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active =
    categories.find((c) => c.id === activeId) ?? categories[0] ?? null;
  const [openQ, setOpenQ] = useState<string | null>(active?.items[0]?.q ?? null);

  // Switching category opens that category's first question, so the panel is
  // never a wall of collapsed rows.
  useEffect(() => {
    const cat = categories.find((c) => c.id === activeId) ?? categories[0] ?? null;
    setOpenQ(cat?.items[0]?.q ?? null);
  }, [activeId, categories]);

  if (!active) return null;

  return (
    <div className="cd-faq">
      <aside className="cd-faq__cats" aria-label="FAQ categories">
        <p className="cd-faq__cats-label">Categories</p>
        <ul className="cd-faq__cats-list">
          {categories.map((cat) => {
            const isActive = cat.id === active.id;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  className={`cd-faq__cat-btn${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveId(cat.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="cd-faq__cat-title">{cat.title}</span>
                  <span className="cd-faq__cat-count">{cat.items.length}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="cd-faq__panel">
        <header className="cd-faq__panel-head">
          <h2>{active.title}</h2>
          <p>{active.blurb}</p>
        </header>

        <div className="cd-faq__list">
          {active.items.map((item, i) => {
            const open = openQ === item.q;
            const panelId = `${baseId}-panel-${i}`;
            const btnId = `${baseId}-btn-${i}`;
            return (
              <div key={item.q} className={`cd-faq__item${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  id={btnId}
                  className="cd-faq__trigger"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenQ(open ? null : item.q)}
                >
                  {item.q}
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="cd-faq__anim"
                  aria-hidden={!open}
                >
                  <div className="cd-faq__anim-inner">
                    <div className="cd-faq__answer">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
