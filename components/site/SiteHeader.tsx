"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, siteConfig } from "@/lib/site-config";
import { useCart } from "@/lib/cart/CartContext";
import { Mail, MapPin, Menu, Phone, ShoppingBag, User, X } from "lucide-react";

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const [navOpen, setNavOpen] = useState(false);
  const { count: cartCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  return (
    <header className="cd-site-header">
      <div className="cd-site-header__top">
        <div className="cd-site-header__top-inner">
          <span>
            <MapPin size={14} aria-hidden="true" />
            {siteConfig.address}
          </span>
          <a href={siteConfig.phoneHref}>
            <Phone size={14} aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <a href={`mailto:${siteConfig.email}`}>
            <Mail size={14} aria-hidden="true" />
            {siteConfig.email}
          </a>
        </div>
      </div>

      <div className="cd-site-header__main">
        <div className="cd-site-header__main-inner">
          <Link href="/" className="cd-site-header__brand">
            <img src="/assets/img/logo/crimson-logo.webp" alt="" width={1024} height={1024} />
            <span>Crimson Deli</span>
          </Link>

          <nav className="cd-site-header__nav" aria-label="Main">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-active={navActive(pathname, item.href) ? "true" : "false"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cd-site-header__actions">
            <Link href="/login" className="cd-btn-solid cd-btn-solid--ghost cd-site-header__login">
              <User size={16} aria-hidden="true" />
              Log In
            </Link>
            <Link
              href="/cart"
              className="cd-site-cart"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="cd-site-cart__count">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>
            <button
              type="button"
              className="cd-site-header__menu-btn"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={`cd-site-drawer${navOpen ? " is-open" : ""}`} aria-hidden={!navOpen}>
        <div className="cd-site-drawer__overlay" onClick={() => setNavOpen(false)} />
        <div className="cd-site-drawer__panel" role="dialog" aria-label="Menu">
          <div className="cd-site-drawer__head">
            <Link href="/" className="cd-site-header__brand" onClick={() => setNavOpen(false)}>
              <img src="/assets/img/logo/crimson-logo.webp" alt="" width={1024} height={1024} />
              <span>Crimson Deli</span>
            </Link>
            <button
              type="button"
              className="cd-site-drawer__close"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav className="cd-site-drawer__nav" aria-label="Mobile">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-active={navActive(pathname, item.href) ? "true" : "false"}
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" onClick={() => setNavOpen(false)}>
                  Log In
                </Link>
              </li>
            </ul>
          </nav>

          <div className="cd-site-drawer__contact">
            <span>{siteConfig.address}</span>
            <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <Link href="/contact" className="cd-btn-solid" onClick={() => setNavOpen(false)}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
