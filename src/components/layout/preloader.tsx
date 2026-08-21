"use client";

import { useEffect, useState } from "react";

/** Replaces the template's $(window).on("load", () => $(".preloader").fadeOut()). */
export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setHidden(true);
      return;
    }
    const done = () => setHidden(true);
    window.addEventListener("load", done);
    // Never let a stalled asset trap visitors behind the overlay.
    const bail = window.setTimeout(done, 4000);
    return () => {
      window.removeEventListener("load", done);
      window.clearTimeout(bail);
    };
  }, []);

  if (hidden) return null;
  return (
    <div className="preloader">
      <div className="loader"></div>
    </div>
  );
}
