"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flavorGroupsFor, ingredientsToText } from "@/lib/data/food-menu";
import type { FoodCategory, FoodItem } from "@/lib/data/types";
import ActionMenu, { type MenuAction } from "./ActionMenu";

type Draft = {
  name: string;
  description: string;
  price: string;
  categorySlug: string;
  imageUrl: string;
  /** One comma-separated flavor list per flavor group, keyed by group key. */
  flavors: Record<string, string>;
  /** What the item comes with, one per line. */
  comesWith: string;
  /** Paid extras, one per line, price optional. */
  extras: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  description: "",
  price: "",
  categorySlug: "",
  imageUrl: "",
  flavors: {},
  comesWith: "",
  extras: "",
};

/** "Cherry, Mango" → ["Cherry", "Mango"]. The server trims and de-duplicates. */
function parseFlavors(text: string): string[] {
  return text.split(/[,\n]/);
}

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
  // Which flavor lists this item asks the customer for. Empty for everything
  // except water ice and gelati.
  const flavorGroups = editingProduct ? flavorGroupsFor(editingProduct) : [];

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
      flavors: Object.fromEntries(
        flavorGroupsFor(p).map((g) => [g.key, g.options.join(", ")]),
      ),
      ...ingredientsToText(p),
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
    const { flavors, comesWith, extras, ...fields } = draft;
    const ok = creating
      ? await request("POST", fields, "new")
      : await save(editingProduct!.slug, {
          ...fields,
          ingredients: { comesWith, extras },
          ...(flavorGroups.length > 0
            ? {
                flavorOptions: Object.fromEntries(
                  flavorGroups.map((g) => [g.key, parseFlavors(flavors[g.key] ?? "")]),
                ),
              }
            : {}),
        });
    if (ok) setEditing(null);
  }

  async function remove(p: FoodItem) {
    const ok = await request("DELETE", { slug: p.slug }, p.slug);
    if (ok) setConfirming(null);
  }

  const unpriced = products.filter((p) => p.priceCents === null).length;

  return (
    <>
      {error && !editing && (
        <p className="portal-note" role="alert">
          {error}
        </p>
      )}

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
                  <td data-label="Item">
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
                  <td data-label="Category">{categories.find((c) => c.slug === p.categorySlug)?.name ?? "N/A"}</td>
                  <td data-label="Price">
                    {p.priceCents === null ? (
                      <span className="portal-badge portal-badge-preparing">No price</span>
                    ) : (
                      `$${(p.priceCents / 100).toFixed(2)}`
                    )}
                  </td>
                  <td data-label="Availability">
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
                  <td data-cell="actions" style={{ textAlign: "right" }}>
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
              {/* A modal dialog makes everything behind it inert, so a failed
                  save has to report itself in here to be seen or announced. */}
              {error && (
                <p className="portal-note" role="alert">
                  {error}
                </p>
              )}

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
              {flavorGroups.map((group) => (
                <label key={group.key}>
                  {group.label} — what the customer can choose, separated by commas
                  <textarea
                    rows={2}
                    value={draft.flavors[group.key] ?? ""}
                    placeholder="Watermelon, Mango, Cherry"
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        flavors: { ...draft.flavors, [group.key]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}

              {flavorGroups.length > 0 && (
                <p className="portal-muted" style={{ fontSize: 12, margin: "-4px 0 0" }}>
                  This is the list customers pick from when they order. Clear the box to go
                  back to the standard list.
                </p>
              )}

              {!creating && (
                <>
                  <label>
                    Comes with — one per line, customers can take these off
                    <textarea
                      rows={3}
                      value={draft.comesWith}
                      placeholder={"Turkey\nLettuce\nTomato"}
                      onChange={(e) => setDraft({ ...draft, comesWith: e.target.value })}
                    />
                  </label>
                  <label>
                    Extras customers can add — one per line, price after the name
                    <textarea
                      rows={3}
                      value={draft.extras}
                      placeholder={"Extra cheese 1.00\nBacon 1.50\nAvocado 2"}
                      onChange={(e) => setDraft({ ...draft, extras: e.target.value })}
                    />
                  </label>
                  <p className="portal-muted" style={{ fontSize: 12, margin: "-4px 0 0" }}>
                    Leave both boxes empty and the item is not customisable. A line with no
                    price is a free extra.
                  </p>
                </>
              )}

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
