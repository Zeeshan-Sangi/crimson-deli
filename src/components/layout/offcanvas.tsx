"use client";

import Link from "next/link";
import Image from "next/image";
import MobileNav from "./mobile-nav";
import SiteSearch from "./site-search";
import { useOffcanvas } from "./offcanvas-context";

const SOCIALS = [
  { label: "Facebook", icon: "fab fa-facebook-f" },
  { label: "Twitter", icon: "fab fa-twitter" },
  { label: "Vimeo", icon: "fab fa-vimeo-v" },
  { label: "Pinterest", icon: "fab fa-pinterest-p" },
];

/** The slide-in mobile panel; replaces jQuery's .info-open / .overlay-open toggling. */
export default function Offcanvas() {
  const { open, closePanel } = useOffcanvas();

  return (
    <>
      <div className="fix-area">
        <div className={`offcanvas__info${open ? " info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/" onClick={closePanel}>
                    <Image
                      src="/assets/img/logo/logo.png"
                      alt="Crimson Deli"
                      width={232}
                      height={220}
                    />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={closePanel} aria-label="Close menu">
                    <i className="fa-thin fa-times"></i>
                  </button>
                </div>
              </div>
              <MobileNav />
              <div className="shop-icon-right">
                <Link href="/contact" className="shop-icon" onClick={closePanel}>
                  <i className="fa-regular fa-user"></i>
                </Link>
                <Link href="/shop-cart" className="shop-icon" onClick={closePanel}>
                  <i className="fa-regular fa-bag-shopping"></i>
                </Link>
              </div>
              <SiteSearch />
            </div>
            <div className="social-icon-list">
              <span className="follow-title">Follow us:</span>
              <div className="social-icon d-flex align-items-center">
                {SOCIALS.map((s) => (
                  <a key={s.label} href="#" aria-label={s.label}>
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay${open ? " overlay-open" : ""}`}
        onClick={closePanel}
      ></div>
    </>
  );
}
