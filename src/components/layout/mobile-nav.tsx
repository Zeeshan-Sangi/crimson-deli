"use client";

import Link from "next/link";
import { useState } from "react";
import { flattenNav, MAIN_NAV, type NavItem } from "@/data/navigation";

/**
 * React replacement for jquery.meanmenu.
 * Uses the same MAIN_NAV tree as desktop (mega menus flattened for mobile).
 */
function Branch({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <ul style={depth > 0 ? { display: "block" } : undefined}>
      {items.map((item, i) => {
        const open = openLabel === item.label;
        const last = i === items.length - 1;
        return (
          <li key={item.label} className={last ? "mean-last" : undefined}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <a href="#" onClick={(e) => e.preventDefault()}>
                {item.label}
              </a>
            )}
            {item.children && (
              <>
                <a
                  className="mean-expand"
                  href="#"
                  aria-expanded={open}
                  aria-label={`Toggle ${item.label} submenu`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenLabel(open ? null : item.label);
                  }}
                >
                  <i className={`far ${open ? "fa-minus" : "fa-plus"}`}></i>
                </a>
                {open && <Branch items={item.children} depth={depth + 1} />}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function MobileNav() {
  return (
    <div className="mobile-menu fix mean-container">
      <div className="mean-bar">
        <nav className="mean-nav">
          <Branch items={flattenNav(MAIN_NAV)} />
        </nav>
      </div>
    </div>
  );
}
