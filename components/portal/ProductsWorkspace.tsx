"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FoodCategory, FoodItem } from "@/lib/data/types";
import ActionMenu, { type MenuAction } from "./ActionMenu";

type Draft = {
  name: string;
  description: string;
  price: string;
  categorySlug: string;
  imageUrl: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  description: "",
  price: "",
  categorySlug: "",
  imageUrl: "",
};

export default function ProductsWorkspace({
  products,
  categories,
  canEdit,
}: {
  products: FoodItem[];
  categories: FoodCategory[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  /** null = closed, "new" = add form, otherwise the slug being edited. */
  const [editing, setEditing] = useState<string | null>(null);
  /** Slug awaiting delete confirmation — an inline step, not a browser dialog. */
  const [confirming, setConfirming] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const creating = editing === "new";
  const editingProduct = creating
    ? null
    : products.find((p) => p.slug === editing) ?? null;

  /**
   * Drives the native dialog from React state. `showModal()` rather than the
   * `open` attribute: only the modal form gives focus trapping, Escape, page
   * inertness and ::backdrop for free.
   */
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (editing && !el.open) el.showModal();
    if (!editing && el.open) el.close();
  }, [editing]);

  async function request(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>,
    key: string,
  ) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  const save = (slug: string, patch: Record<string, unknown>) =>
    request("PATCH", { slug, ...patch }, slug);

  function startEdit(p: FoodItem) {
    setError(null);
    setConfirming(null);
    setDraft({
      name: p.name,
      description: p.description,
      price: p.priceCents === null ? "" : (p.priceCents / 100).toFixed(2),
      categorySlug: p.categorySlug,
      imageUrl: p.imageUrl,
    });
    setEditing(p.slug);
  }

  function startCreate() {
    setError(null);
    setConfirming(null);
    setDraft({ ...EMPTY_DRAFT, categorySlug: categories[0]?.slug ?? "" });
    setEditing("new");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = creating
      ? await request("POST", draft, "new")
      : await save(editingProduct!.slug, draft);
    if (ok) setEditing(null);
  }

  async function remove(p: FoodItem) {
    const ok = await request("DELETE", { slug: p.slug }, p.slug);
    if (ok) setConfirming(null);
  }

  const unpriced = products.filter((p) => p.priceCents === null).length;

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      {unpriced > 0 && (
        <div className="portal-note" style={{ marginTop: 0 }}>
          <strong>{unpriced} item{unpriced === 1 ? "" : "s"} still have no price.</strong>{" "}
          Leave the price blank until the store confirms it. The site shows a placeholder
          rather than inventing a number.
        </div>
      )}

      {canEdit && (
        <div className="crm-toolbar">
          <button type="button" className="portal-btn portal-btn-primary" onClick={startCreate}>
            Add product
          </button>
          <span className="portal-muted" style={{ fontSize: 13 }}>
            {products.length} item{products.length === 1 ? "" : "s"} on the fresh food menu
          </span>
        </div>
      )}

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <img
                        src={p.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                        style={{
                          objectFit: "cover",
                          borderRadius: 6,
                          opacity: p.hidden ? 0.45 : 1,
                        }}
                      />
                      <div>
                        <strong>{p.name}</strong>
                        <span className="portal-muted d-block" style={{ fontSize: 12 }}>
                          {p.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{categories.find((c) => c.slug === p.categorySlug)?.name ?? "N/A"}</td>
                  <td>
                    {p.priceCents === null ? (
                      <span className="portal-badge portal-badge-preparing">No price</span>
                    ) : (
                      `$${(p.priceCents / 100).toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {p.hidden ? (
                      <span className="portal-badge portal-badge-new">Hidden</span>
                    ) : (
                      <span
                        className={`portal-badge ${p.available ? "portal-badge-packed" : "portal-badge-new"}`}
                      >
                        {p.available ? "Available" : "Sold out"}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {confirming === p.slug ? (
                      /* Inline confirm rather than window.confirm: a native dialog
                         blocks the page and looks nothing like the portal. */
                      <div className="crm-actions crm-actions--confirm">
                        <span className="portal-muted" style={{ fontSize: 13 }}>
                          Delete <strong>{p.name}</strong> permanently?
                        </span>
                        <button
                          type="button"
                          className="portal-btn portal-btn-danger"
                          disabled={busy === p.slug}
                          onClick={() => remove(p)}
                        >
                          {busy === p.slug ? "Deleting…" : "Yes, delete"}
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
                        label={`Actions for ${p.name}`}
                        actions={[
                          {
                            label: p.available ? "Mark sold out" : "Mark available",
                            disabled: busy === p.slug || p.hidden,
                            title: p.hidden ? "Show this item on the site first." : undefined,
                            onSelect: () => save(p.slug, { available: !p.available }),
                          },
                          ...(canEdit
                            ? ([
                                {
                                  label: p.hidden ? "Show on site" : "Hide from site",
                                  disabled: busy === p.slug,
                                  onSelect: () => save(p.slug, { hidden: !p.hidden }),
                                },
                                { label: "Edit details", onSelect: () => startEdit(p) },
                                {
                                  label: "Delete",
                                  danger: true,
                                  onSelect: () => setConfirming(p.slug),
                                },
                              ] as MenuAction[])
                            : []),
                        ]}
                      />
                    )}
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="portal-muted" style={{ padding: 24 }}>
                    No products yet. Use <strong>Add product</strong> to create the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* One dialog serves both add and edit, kept outside the table because a
          <dialog> is not valid table content. */}
      <dialog
        ref={dialogRef}
        className="portal-modal"
        aria-labelledby="product-modal-title"
        onClose={() => setEditing(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setEditing(null);
        }}
      >
        {editing && (
          <div className="portal-modal__panel">
            <div className="portal-modal__head">
              <div>
                <h2 id="product-modal-title">{creating ? "Add product" : "Edit item"}</h2>
                <p>{creating ? "It appears on the site as soon as you save." : editingProduct?.name}</p>
              </div>
              <button
                type="button"
                className="portal-modal__close"
                aria-label="Close"
                onClick={() => setEditing(null)}
              >
                &times;
              </button>
            </div>

            <form className="portal-form" onSubmit={onSubmit}>
              <label>
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  required
                  autoFocus
                />
              </label>
              <label>
                Description
                <textarea
                  rows={2}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </label>
              <label>
                Price in dollars. Leave blank if the store has not set one.
                <input
                  inputMode="decimal"
                  placeholder="e.g. 9.50"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                />
              </label>
              <label>
                Category
                <select
                  value={draft.categorySlug}
                  onChange={(e) => setDraft({ ...draft, categorySlug: e.target.value })}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Image path {creating && <span className="portal-muted">(optional)</span>}
                <input
                  placeholder="/assets/img/crimson/products/example.webp"
                  value={draft.imageUrl}
                  onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                />
              </label>

              <div className="portal-modal__actions">
                <button
                  type="submit"
                  className="portal-btn portal-btn-primary"
                  disabled={busy === (creating ? "new" : editingProduct?.slug)}
                >
                  {busy ? "Saving…" : creating ? "Add product" : "Save changes"}
                </button>
                <button type="button" className="portal-btn" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>
    </>
  );
}
