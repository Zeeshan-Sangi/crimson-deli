import Link from "next/link";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";
import { FoodLineArt, Zig } from "@/components/auth/BrandArt";
import type { SessionUser } from "@/lib/auth/types";
import { ArrowLeft } from "lucide-react";

/**
 * Portal chrome — same brand language as /login: crimson sidebar with food
 * line-art, organic cream sweep, warm form surfaces on the right.
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
  return (
    <div className="crm portal-body">
      <aside className="crm-sidebar">
        <FoodLineArt className="crm-sidebar__pattern" />
        <span className="crm-sidebar__cutout" aria-hidden="true" />

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
