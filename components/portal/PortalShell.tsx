"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";
import { FoodLineArt, Zig } from "@/components/auth/BrandArt";
import type { SessionUser } from "@/lib/auth/types";
import { ArrowLeft, Menu, X } from "lucide-react";

/**
 * Portal chrome — same brand language as /login: crimson sidebar with food
 * line-art, organic cream sweep, warm form surfaces on the right.
 *
 * On a phone the sidebar becomes an off-canvas drawer behind the topbar button.
 * It used to squash into a horizontally scrolling strip, which hid most of the
 * nine destinations off the right edge with nothing to say they were there.
 */
export default function PortalShell({
  user,
  title,
  subtitle,
  actions,
  children,
}: {
  user: SessionUser;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // Tapping a destination should leave the drawer behind, not on top of the
  // page it just opened.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Escape closes it, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!navOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  return (
    <div className="crm portal-body">
      {/* Only rendered as a visible layer by the mobile media query. */}
      <div
        className="crm-scrim"
        data-open={navOpen ? "true" : "false"}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      <aside className="crm-sidebar" data-open={navOpen ? "true" : "false"}>
        <FoodLineArt className="crm-sidebar__pattern" />
        <span className="crm-sidebar__cutout" aria-hidden="true" />

        <button
          type="button"
          className="crm-sidebar__close"
          onClick={() => setNavOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <Link href="/" className="crm-brand">
          <img src="/assets/img/logo/crimson-logo.webp" alt="" width={1024} height={1024} />
          <span>Crimson Deli</span>
        </Link>

        <Zig className="crm-sidebar__bolt crm-sidebar__bolt--1" />
        <Zig className="crm-sidebar__bolt crm-sidebar__bolt--2" />

        <SidebarNav role={user.role} />

        <Link href="/" className="crm-sidebar__back">
          <ArrowLeft size={14} aria-hidden="true" /> View storefront
        </Link>
      </aside>

      <div className="crm-main">
        <FoodLineArt className="crm-main__art" />
        <Zig className="crm-main__bolt crm-main__bolt--1" />
        <Zig className="crm-main__bolt crm-main__bolt--2" />

        <header className="crm-topbar">
          <button
            type="button"
            className="crm-navtoggle"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            aria-expanded={navOpen}
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          <div className="crm-topbar__heading">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="crm-topbar__right">
            {actions}
            <UserMenu user={user} />
          </div>
        </header>

        <main className="crm-content">{children}</main>
      </div>
    </div>
  );
}
