"use client";

import { useState } from "react";
import { Stars, StarPicker } from "./StarRating";
import type { Review, ReviewSummary } from "@/lib/reviews/types";
import "./product-tabs.css";

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
  });
}

export default function ProductTabs({
  productSlug,
  description,
  initialReviews,
  initialSummary,
}: {
  productSlug: string;
  description: string;
  initialReviews: Review[];
  initialSummary: ReviewSummary;
}) {
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productSlug, name, rating, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save your review.");
        return;
      }
      // Prepend locally rather than refetching — the server just told us the
      // new row and the recalculated summary.
      setReviews((prev) => [data.review as Review, ...prev]);
      setSummary(data.summary as ReviewSummary);
      setName("");
      setRating(0);
      setBody("");
      setDone(true);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="cd-tabs">
      <div className="cd-tabs__bar" role="tablist" aria-label="Item information">
        <button
          type="button"
          role="tab"
          id="tab-description"
          aria-selected={tab === "description"}
          aria-controls="panel-description"
          className="cd-tabs__tab"
          onClick={() => setTab("description")}
        >
          Description
        </button>
        <button
          type="button"
          role="tab"
          id="tab-reviews"
          aria-selected={tab === "reviews"}
          aria-controls="panel-reviews"
          className="cd-tabs__tab"
          onClick={() => setTab("reviews")}
        >
          Reviews <span className="cd-tabs__count">{summary.count}</span>
        </button>
      </div>

      {tab === "description" && (
        <div
          className="cd-tabs__panel"
          role="tabpanel"
          id="panel-description"
          aria-labelledby="tab-description"
        >
          <p className="cd-tabs__lede">{description}</p>
          <ul className="cd-facts">
            <li><strong>Made fresh</strong> at the counter when you order.</li>
            <li><strong>Pickup only</strong> — we don&rsquo;t deliver fresh food.</li>
            <li><strong>Prices confirmed</strong> by the store at pickup.</li>
          </ul>
        </div>
      )}

      {tab === "reviews" && (
        <div
          className="cd-tabs__panel"
          role="tabpanel"
          id="panel-reviews"
          aria-labelledby="tab-reviews"
        >
          <div className="cd-reviews">
            <div className="cd-reviews__list">
              {summary.count > 0 ? (
                <div className="cd-reviews__summary">
                  <div className="cd-reviews__avg">
                    <span className="cd-reviews__num">{summary.average?.toFixed(1)}</span>
                    <Stars
                      value={summary.average ?? 0}
                      label={`${summary.average} out of 5, ${summary.count} reviews`}
                    />
                    <span className="cd-reviews__count">
                      {summary.count} review{summary.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="cd-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const n = summary.distribution[star - 1];
                      const pct = summary.count ? (n / summary.count) * 100 : 0;
                      return (
                        <li key={star}>
                          <span className="cd-bars__label">{star}★</span>
                          <span className="cd-bars__track">
                            <span className="cd-bars__fill" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="cd-bars__n">{n}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="cd-reviews__empty">
                  No reviews yet. If you&rsquo;ve tried this, you&rsquo;d be the first.
                </p>
              )}

              {reviews.map((r) => (
                <article key={r.id} className="cd-review">
                  <div className="cd-review__head">
                    <strong>{r.name}</strong>
                    <span className="cd-review__date">{when(r.createdAt)}</span>
                  </div>
                  <Stars value={r.rating} label={`${r.rating} out of 5`} />
                  <p className="cd-review__body">{r.body}</p>
                </article>
              ))}
            </div>

            <form className="cd-reviewform" onSubmit={submit}>
              <h3>Write a review</h3>

              {done && (
                <p className="cd-reviewform__ok" role="status">
                  Thanks — your review is live.
                </p>
              )}
              {error && (
                <p className="cd-reviewform__err" role="alert">
                  {error}
                </p>
              )}

              <label>
                Your rating
                <StarPicker value={rating} onChange={(v) => { setRating(v); setDone(false); }} />
              </label>

              <label>
                Your name
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setDone(false); }}
                  maxLength={60}
                  required
                />
              </label>

              <label>
                Your review
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => { setBody(e.target.value); setDone(false); }}
                  maxLength={1500}
                  placeholder="How was it? What would you tell a friend?"
                  required
                />
              </label>

              <button type="submit" className="cd-reviewform__submit" disabled={busy}>
                {busy ? "Posting…" : "Post review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
