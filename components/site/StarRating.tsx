"use client";

import { useId, useState } from "react";

function Star({ fill }: { fill: number }) {
  // `fill` is 0–1, so a 4.3 average can show a partially filled fifth star.
  const id = useId();
  return (
    <svg viewBox="0 0 20 20" className="cd-star" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.22 5.06 16.8l.94-5.5-4-3.9 5.53-.8z"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Read-only star row. */
export function Stars({ value, label }: { value: number; label?: string }) {
  return (
    <span className="cd-stars" role="img" aria-label={label ?? `${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={Math.min(1, Math.max(0, value - i))} />
      ))}
    </span>
  );
}

/**
 * Star picker. Radio inputs rather than buttons, so it is a single labelled
 * group for screen readers and arrow keys move between values for free.
 */
export function StarPicker({
  value,
  onChange,
  name = "rating",
}: {
  value: number;
  onChange: (v: number) => void;
  name?: string;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <span className="cd-starpick" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          className="cd-starpick__item"
          onMouseEnter={() => setHover(n)}
          data-on={n <= shown ? "true" : "false"}
        >
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
          />
          <Star fill={n <= shown ? 1 : 0} />
          <span className="cd-sr-only">{n} star{n === 1 ? "" : "s"}</span>
        </label>
      ))}
    </span>
  );
}
