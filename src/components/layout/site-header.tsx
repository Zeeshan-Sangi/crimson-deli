"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CATEGORIES, CONTACT, TOP_BAR_NAV } from "@/data/navigation";
import DesktopNav from "./desktop-nav";
import SiteSearch from "./site-search";
import { useOffcanvas } from "./offcanvas-context";

export default function SiteHeader() {
  const { openPanel } = useOffcanvas();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    // Template behaviour: #header-sticky gains .sticky past 250px of scroll.
    const onScroll = () => setStuck(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header-section-2">
      <div className="top-menu-area-2">
        <div className="container">
          <div className="middle-list-items">
            <ul className="middle-list">
              {TOP_BAR_NAV.map((item) => (
                <li key={item.label}>
                  <Link href={item.href!}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="middle-right">
              <p className="number">
                Need Help? Call Us: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </p>
              <div className="head-line"></div>
              <Link href="/contact" className="link-text">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="middle-header-2">
        <div className="container">
          <div className="middle-header-items-2">
            <Link href="/" className="main-logo">
              <Image
                priority
                src="/assets/img/logo/logo.png"
                alt="Crimson Deli"
                width={232}
                height={220}
              />
            </Link>
            <SiteSearch />
            <div className="middle-right">
              <div className="location-items">
                <div className="icon">
                  <Image
                    src="/assets/img/logo/location.png"
                    alt=""
                    width={29}
                    height={34}
                  />
                </div>
                <div className="form-clt">
                  <p>Our Store</p>
                  <p className="selected-location">{CONTACT.address}</p>
                </div>
              </div>
              <div className="shop-icon-right">
                <Link href="/contact" className="shop-icon" aria-label="Account">
                  <i className="fa-regular fa-user"></i>
                </Link>
                <Link href="/shop-cart" className="shop-icon" aria-label="Cart">
                  <i className="fa-regular fa-bag-shopping"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="header-sticky"
        className={`header-1 header-2 header-4${stuck ? " sticky" : ""}`}
      >
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <Link href="/" className="logo-1">
                <Image
                  src="/assets/img/logo/logo.png"
                  alt="Crimson Deli"
                  width={232}
                  height={220}
                />
              </Link>
              <div className="category-wrapper">
                <button className="category-btn">
                  <span className="icon">
                    <i className="fa-regular fa-bars"></i>
                  </span>
                  ALL CATEGORIES
                  <span className="arrow">
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </button>
                <div className="category-dropdown">
                  <ul>
                    {CATEGORIES.map((c) => (
                      <li key={c.label}>
                        <Link href={c.href!}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <DesktopNav />
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="order-info">
                  <div className="icon">
                    <Image src="/assets/img/logo/call.png" alt="" width={58} height={39} />
                  </div>
                  <div className="info-cont">
                    <p>For Order</p>
                    <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                  </div>
                </div>
                <div className="header__hamburger my-auto d-xl-none">
                  <button
                    className="sidebar__toggle"
                    onClick={openPanel}
                    aria-label="Open menu"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
