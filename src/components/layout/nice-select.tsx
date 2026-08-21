"use client";

import { useEffect, useRef, useState } from "react";

/**
 * React replacement for the jquery.nice-select plugin.
 *
 * Renders the exact markup the plugin produced (.nice-select > .current + .list
 * > .option) so the template's existing CSS styles it unchanged.
 */
export default function NiceSelect({
  options,
  className = "",
  onChange,
}: {
  options: string[];
  className?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0] ?? "");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (value: string) => {
    setSelected(value);
    setOpen(false);
    onChange?.(value);
  };

  return (
    <div
      ref={root}
      className={`nice-select ${className}${open ? " open" : ""}`}
      tabIndex={0}
      role="listbox"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      <span className="current">{selected}</span>
      <ul className="list" onClick={(e) => e.stopPropagation()}>
        {options.map((option, i) => (
          <li
            key={`${option}-${i}`}
            role="option"
            aria-selected={option === selected}
            data-value={option}
            className={`option${option === selected ? " selected focus" : ""}`}
            onClick={() => pick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
