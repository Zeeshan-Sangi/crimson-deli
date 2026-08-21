"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV, type NavItem } from "@/data/navigation";

function SubMenu({ items }: { items: NavItem[] }) {
  return (
    <ul className="submenu">
      {items.map((item) =>
        item.children ? (
          <li key={item.label} className="has-dropdown">
            <a href="#" onClick={(e) => e.preventDefault()}>
              {item.label}
              <i className="fas fa-angle-right"></i>
            </a>
            <SubMenu items={item.children} />
          </li>
        ) : (
          <li key={item.label}>
            <Link href={item.href!}>{item.label}</Link>
          </li>
        ),
      )}
    </ul>
  );
}

function MegaMenu({ groups }: { groups: NonNullable<NavItem["groups"]> }) {
  return (
    <div className="submenu mega-submenu">
      <div className="mega-submenu-inner">
        {groups.map((group) => (
          <div key={group.title} className="mega-col">
            <span className="mega-col-title">{group.title}</span>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href!}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesktopNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem): boolean => {
    if (item.href === pathname) return true;
    if (item.href && item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
    if (item.groups?.some((g) => g.items.some(isActive))) return true;
    return item.children?.some(isActive) ?? false;
  };

  return (
    <nav id="mobile-menu">
      <ul>
        {MAIN_NAV.map((item) => {
          const hasMenu = Boolean(item.children?.length || item.mega);
          const classes = [hasMenu ? "has-dropdown" : "", isActive(item) ? "active" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={item.label} className={classes || undefined}>
              {item.href ? (
                <Link href={item.href}>
                  {item.label}
                  {hasMenu && <i className="fa-solid fa-chevron-down"></i>}
                </Link>
              ) : (
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {item.label}
                  <i className="fa-solid fa-chevron-down"></i>
                </a>
              )}
              {item.mega && item.groups ? (
                <MegaMenu groups={item.groups} />
              ) : (
                item.children && <SubMenu items={item.children} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
