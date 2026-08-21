"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type OffcanvasValue = {
  open: boolean;
  openPanel: () => void;
  closePanel: () => void;
};

const OffcanvasContext = createContext<OffcanvasValue | null>(null);

/**
 * The hamburger lives in the header and the panel lives in the page chrome, so
 * they share state through context instead of the template's global jQuery
 * class toggling on .offcanvas__info / .offcanvas__overlay.
 */
export function OffcanvasProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openPanel, closePanel }), [open, openPanel, closePanel]);
  return <OffcanvasContext.Provider value={value}>{children}</OffcanvasContext.Provider>;
}

export function useOffcanvas() {
  const ctx = useContext(OffcanvasContext);
  if (!ctx) throw new Error("useOffcanvas must be used inside <OffcanvasProvider>");
  return ctx;
}
