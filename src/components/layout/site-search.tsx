"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** The template shipped <form action="#">, which did nothing. */
export default function SiteSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
      }}
      role="search"
    >
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        aria-label="Search products"
      />
      <button type="submit" aria-label="Search">
        <i className="fa-regular fa-magnifying-glass"></i>
      </button>
    </form>
  );
}
