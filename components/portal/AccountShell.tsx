import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserMenu from "./UserMenu";
import { siteConfig } from "@/lib/site-config";
import type { SessionUser } from "@/lib/auth/types";

/**
 * Chrome for a customer's account page.
 *
 * PortalShell is built around the staff sidebar, and a customer has exactly one
 * destination in it — which rendered as a mostly empty crimson panel and read
 * like a broken admin tool. This keeps the same surfaces and typography but
 * drops the sidebar for a plain centred page with a way back to the shop.
 */
export default function AccountShell({
  user,
  title,
  subtitle,
  children,
}: {
  user: SessionUser;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crm portal-body crm--plain">
      <div className="crm-main crm-main--plain">
        <header className="crm-topbar">
          <div className="crm-topbar__heading">
            <Link href="/" className="crm-plain__brand">
              <img
                src="/assets/img/logo/crimson-logo.webp"
                alt=""
                width={1024}
                height={1024}
              />
              <span>{siteConfig.name}</span>
            </Link>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="crm-topbar__right">
            <Link href="/" className="portal-btn crm-plain__back">
              <ArrowLeft size={14} aria-hidden="true" /> Back to shop
            </Link>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="crm-content crm-content--plain">{children}</main>
      </div>
    </div>
  );
}
