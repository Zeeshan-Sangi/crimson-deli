import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  XIcon,
} from "@/components/site/BrandIcons";

const columns = [
  {
    title: "Fresh Food",
    links: [
      { href: "/food", label: "Menu" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Pickup checkout" },
    ],
  },
  {
    title: "Essentials",
    links: [
      { href: "/store", label: "Store catalog" },
      { href: siteConfig.doordashUrl, label: "Order on DoorDash", external: true },
      { href: "/about", label: "DoorDash delivery" },
    ],
  },
  {
    title: "Visit",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Staff login" },
    ],
  },
];

/** Only profiles with a real URL are rendered — see siteConfig.social. */
const socials = [
  { label: "Facebook", Icon: FacebookIcon, href: siteConfig.social.facebook },
  { label: "X", Icon: XIcon, href: siteConfig.social.x },
  { label: "Instagram", Icon: InstagramIcon, href: siteConfig.social.instagram },
  { label: "Pinterest", Icon: PinterestIcon, href: siteConfig.social.pinterest },
].filter((s) => s.href);

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="cd-site-footer">
      {/* Just "Crimson" — the full name is too wide and gets cropped on both
          edges, which reads as an accident rather than a deliberate crop. */}
      <span className="cd-site-footer__watermark" aria-hidden="true">
        Crimson
      </span>

      <div className="cd-site-footer__shell">
        <div className="cd-site-footer__main">
          <div className="cd-site-footer__brand">
            <Link href="/" className="cd-site-footer__logo">
              <img src="/assets/img/logo/crimson-logo.webp" alt="" width={1024} height={1024} />
              <span>{siteConfig.name}</span>
            </Link>
            <p>
              Fresh hoagies, sandwiches, fruit bowls and smoothies made in-store for pickup at
              Ogontz Avenue — plus everyday essentials on our shelves or on DoorDash.
            </p>
            <p className="cd-site-footer__meta">
              {siteConfig.address} ·{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            </p>
          </div>

          <div className="cd-site-footer__cols">
            {columns.map((col) => (
              <div key={col.title} className="cd-site-footer__col">
                <h2 className="cd-site-footer__title">{col.title}</h2>
                <ul className="cd-site-footer__links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="cd-site-footer__bottom">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="cd-site-footer__bottom-right">
            {socials.length > 0 && (
              <div className="cd-site-footer__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            )}
            <Link href="/contact">Contact</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
