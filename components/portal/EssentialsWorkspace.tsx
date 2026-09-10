"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ConvenienceProduct } from "@/lib/data/types";

type Filter = "all" | "carried" | "not-carried";

/**
 * Everyday essentials: which catalogue items the store actually carries.
 *
 * The catalogue itself came from the DoorDash listing and drifts from the
 * shelves, so this is the store's own switch — hiding an item takes it off
 * /store without touching the catalogue file.
 */
export default function EssentialsWorkspace({
  products,
  categories,
  hidden,
  canEdit,
}: {
  products: ConvenienceProduct[];
  categories: { slug: string; name: string }[];
  hidden: string[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hiddenSet = useMemo(() => new Set(hidden), [hidden]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.cat !== category) return false;
      if (filter === "carried" && hiddenSet.has(p.slug)) return false;
      if (filter === "not-carried" && !hiddenSet.has(p.slug)) return false;
      return !q || p.name.toLowerCase().includes(q);
    });
  }, [products, query, category, filter, hiddenSet]);

  async function toggle(product: ConvenienceProduct) {
    const next = !hiddenSet.has(product.slug);
    setBusy(product.slug);
    setError(null);
    try {
      const res = await fetch("/api/essentials", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: product.slug, hidden: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save the change.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      <div className="portal-note" style={{ marginTop: 0 }}>
        <strong>This list came from the DoorDash catalog, not the shelves.</strong>{" "}
        Anything the store does not carry can be switched off here — it disappears from
        Everyday Essentials on the site straight away, and switching it back on restores
        it. Prices shown are the DoorDash ones.
      </div>

      <div className="crm-toolbar">
        <input
          type="search"
          placeholder="Search essentials…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search everyday essentials"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="all">All departments</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          aria-label="Filter by whether the store carries the item"
        >
          <option value="all">Carried and not carried</option>
          <option value="carried">On the site</option>
          <option value="not-carried">Not carried</option>
        </select>
        <span className="portal-muted" style={{ fontSize: 13 }}>
          {filtered.length} of {products.length} · {hidden.length} not carried
        </span>
      </div>

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Department</th>
                <th>DoorDash price</th>
                <th>On the site</th>
                {canEdit && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const off = hiddenSet.has(p.slug);
                return (
                  <tr key={p.slug}>
                    <td data-label="Item">
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <img
                          src={p.img}
                          alt=""
                          width={40}
                          height={40}
                          style={{
                            objectFit: "cover",
                            borderRadius: 6,
                            opacity: off ? 0.45 : 1,
                          }}
                        />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td data-label="Department">{p.catLabel}</td>
                    <td data-label="DoorDash price">{p.price}</td>
                    <td data-label="On the site">
                      <span
                        className={`portal-badge ${off ? "portal-badge-new" : "portal-badge-packed"}`}
                      >
                        {off ? "Not carried" : "Listed"}
                      </span>
                    </td>
                    {canEdit && (
                      <td data-cell="actions" style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="portal-btn"
                          disabled={busy === p.slug}
                          onClick={() => toggle(p)}
                        >
                          {busy === p.slug
                            ? "Saving…"
                            : off
                              ? "We carry this"
                              : "We don't carry this"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="portal-muted" style={{ padding: 16, fontSize: 13 }}>
              Nothing matches that search.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
