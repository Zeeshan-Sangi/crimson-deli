"use client";

import { useEffect, useState } from "react";

/** Replaces the template's jQuery scroll handler + #back-top click binding. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Template behaviour: reveal once the page is scrolled to the bottom.
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      setShow(atBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      id="back-top"
      className={`back-to-top${show ? " show" : ""}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <i className="fa-regular fa-arrow-up"></i>
    </button>
  );
}
