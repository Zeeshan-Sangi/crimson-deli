"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export type MenuAction = {
  label: string;
  onSelect: () => void;
  /** Renders in the destructive style and sits below a divider. */
  danger?: boolean;
  disabled?: boolean;
  /** Tooltip, useful for explaining why an item is disabled. */
  title?: string;
};

/**
 * Row action menu — the "⋮" kebab.
 *
 * Positioned `fixed` from the trigger's rect rather than absolutely inside the
 * row: the tables scroll horizontally (`.crm-table-wrap { overflow-x: auto }`),
 * and an absolutely positioned menu would be clipped by that container. The
 * trade-off is that the menu must close on scroll and resize, since fixed
 * coordinates don't follow the page.
 */
export default function ActionMenu({
  actions,
  label = "Actions",
}: {
  actions: MenuAction[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    // Fixed coordinates go stale the moment anything scrolls.
    const onMove = () => setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  // Move focus into the menu so keyboard users land on the first item.
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }, [open]);

  const firstDanger = actions.findIndex((a) => a.danger);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="portal-kebab"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="3" r="1.5" fill="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="8" cy="13" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {open && pos && (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          className="portal-menu"
          style={{ top: pos.top, right: pos.right }}
        >
          {actions.map((a, i) => (
            <button
              key={a.label}
              type="button"
              role="menuitem"
              className={`portal-menu__item${a.danger ? " portal-menu__item--danger" : ""}${
                i === firstDanger && i > 0 ? " portal-menu__item--divide" : ""
              }`}
              disabled={a.disabled}
              title={a.title}
              onClick={() => {
                setOpen(false);
                a.onSelect();
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
