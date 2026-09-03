"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ActionMenu from "./ActionMenu";
import type { Review } from "@/lib/reviews/types";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ReviewsWorkspace({
  reviews,
  productNames,
}: {
  reviews: Review[];
  /** slug → display name, so the table shows "Hoagie" not "deli-burger". */
  productNames: Record<string, string>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState<"all" | string>("all");
  const [stars, setStars] = useState<"all" | string>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      if (slug !== "all" && r.productSlug !== slug) return false;
      if (stars !== "all" && r.rating !== Number(stars)) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.body.toLowerCase().includes(q) ||
        (productNames[r.productSlug] ?? r.productSlug).toLowerCase().includes(q)
      );
    });
  }, [reviews, query, slug, stars, productNames]);

  async function remove(r: Review) {
    setBusy(r.id);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: r.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not remove the review.");
        return;
      }
      setConfirming(null);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  const average =
    reviews.length === 0
      ? null
      : Math.round((reviews.reduce((n, r) => n + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      <div className="portal-stats">
        <div className="crm-stat">
          <div className="crm-stat__label">Total reviews</div>
          <div className="crm-stat__value">{reviews.length}</div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Average rating</div>
          <div className="crm-stat__value">
            {average === null ? "—" : average}
            {average !== null && <span className="crm-stat__unit"> out of 5</span>}
          </div>
        </div>
        <div className="crm-stat">
          <div className="crm-stat__label">Items reviewed</div>
          <div className="crm-stat__value">
            {new Set(reviews.map((r) => r.productSlug)).size}
          </div>
        </div>
      </div>

      <div className="crm-toolbar">
        <input
          type="search"
          placeholder="Search name, item or wording…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search reviews"
        />
        <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label="Filter by item">
          <option value="all">All items</option>
          {Object.entries(productNames).map(([s, name]) => (
            <option key={s} value={s}>{name}</option>
          ))}
        </select>
        <select value={stars} onChange={(e) => setStars(e.target.value)} aria-label="Filter by rating">
          <option value="all">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={String(n)}>{n} star{n === 1 ? "" : "s"}</option>
          ))}
        </select>
        <span className="portal-muted" style={{ fontSize: 13 }}>
          {filtered.length} of {reviews.length}
        </span>
      </div>

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Rating</th>
                <th>Review</th>
                <th>When</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="crm-empty">
                    {reviews.length === 0
                      ? "No reviews yet. They appear here the moment a customer leaves one."
                      : "Nothing matches that filter."}
                  </td>
                </tr>
              )}

              {filtered.map((r) => (
                <tr key={r.id}>
                  <td data-label="Item">
                    <strong>{productNames[r.productSlug] ?? r.productSlug}</strong>
                  </td>
                  <td data-label="Rating" style={{ whiteSpace: "nowrap" }}>
                    <span className="portal-badge portal-badge-packed">{r.rating}★</span>
                  </td>
                  <td data-label="Review">
                    <strong>{r.name}</strong>
                    <span className="portal-muted d-block" style={{ fontSize: 13 }}>
                      {r.body}
                    </span>
                  </td>
                  <td data-label="When" style={{ whiteSpace: "nowrap" }}>{when(r.createdAt)}</td>
                  <td data-cell="actions" style={{ textAlign: "right" }}>
                    {confirming === r.id ? (
                      <div className="crm-actions crm-actions--confirm">
                        <span className="portal-muted" style={{ fontSize: 13 }}>
                          Remove this review?
                        </span>
                        <button
                          type="button"
                          className="portal-btn portal-btn-danger"
                          disabled={busy === r.id}
                          onClick={() => remove(r)}
                        >
                          {busy === r.id ? "Removing…" : "Yes, remove"}
                        </button>
                        <button
                          type="button"
                          className="portal-btn"
                          onClick={() => setConfirming(null)}
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <ActionMenu
                        label={`Actions for review by ${r.name}`}
                        actions={[
                          {
                            label: "View on site",
                            onSelect: () =>
                              window.open(`/food/${r.productSlug}`, "_blank", "noopener"),
                          },
                          {
                            label: "Remove review",
                            danger: true,
                            disabled: busy === r.id,
                            onSelect: () => setConfirming(r.id),
                          },
                        ]}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
