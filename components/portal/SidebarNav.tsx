"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartLine,
  ConciergeBell,
  Gauge,
  Receipt,
  Sandwich,
  SlidersHorizontal,
  Star,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/auth/types";

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean; roles: Role[] };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: Gauge, exact: true, roles: ["admin"] },
      { href: "/team", label: "Live board", icon: ConciergeBell, roles: ["staff", "admin"] },
      { href: "/admin/orders", label: "Orders", icon: Receipt, roles: ["admin"] },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Sandwich, roles: ["admin"] },
      { href: "/admin/reviews", label: "Reviews", icon: Star, roles: ["admin"] },
    ],
  },
  {
    title: "Store",
    items: [
      { href: "/admin/settings", label: "Settings", icon: SlidersHorizontal, roles: ["admin"] },
      { href: "/admin/staff", label: "Staff", icon: Users, roles: ["admin"] },
      { href: "/admin/reports", label: "Reports", icon: ChartLine, roles: ["admin"] },
    ],
  },
  {
    title: "You",
    items: [
      { href: "/account", label: "My account", icon: User, roles: ["customer", "staff", "admin"] },
    ],
  },
];

export default function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="crm-nav" aria-label="Portal sections">
      {GROUPS.map((group) => {
        const items = group.items.filter((i) => i.roles.includes(role));
        if (items.length === 0) return null;
        return (
          <div key={group.title} className="crm-nav__group">
            <p className="crm-nav__title">{group.title}</p>
            {items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="crm-nav__link"
                  data-active={active ? "true" : "false"}
                >
                  <item.icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
