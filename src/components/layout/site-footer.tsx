import Link from "next/link";
import Image from "next/image";
import { CONTACT } from "@/data/navigation";
import {
  COPYRIGHT,
  INFORMATION_LINKS,
  OPENING_HOURS,
  QUICK_LINKS,
  SOCIAL_LINKS,
} from "@/data/footer";
import { PRODUCTS } from "@/data/products";

/** Small helper so the three link widgets stay identical in markup. */
function LinkWidget({ title, items }: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div className="footer-widget-items">
      <div className="widget-head">
        <span className="widget-title">{title}</span>
        <div className="dashed"></div>
      </div>
      <ul className="list-items">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href!}>
              <i className="fa-solid fa-chevron-right"></i> {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * `paddingClass` reserves room for the CTA section that overlaps the footer,
 * and differs between the home page and inner pages.
 */
export default function SiteFooter({
  paddingClass = "footer-fix-padding-7",
}: {
  paddingClass?: string;
}) {
  // The template listed six hard-coded product names (one twice); show real ones.
  const featured = PRODUCTS.slice(0, 6);

  return (
    <footer className={`footer-section-4 fix pb-0 bg-white ${paddingClass}`}>
      <div className="container">
        <div className="footer-widget-wrapper style-widget-wrapper-4">
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 wow fadeInUp">
              <div className="footer-widget-items">
                <div className="widget-head">
                  <span className="widget-title">Opening Hours</span>
                  <div className="dashed"></div>
                </div>
                <ul className="opening-hours-list">
                  {OPENING_HOURS.map((row, i) => (
                    <li key={row.value} className={i === OPENING_HOURS.length - 1 ? "style-4" : undefined}>
                      {row.label && <span>{row.label}</span>} {row.value}
                    </li>
                  ))}
                </ul>
                <div className="social-icon d-flex align-items-center">
                  {SOCIAL_LINKS.map((s) => (
                    <a key={s.label} href={s.href} aria-label={s.label}>
                      <i className={s.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-xxl-2 col-xl-3 col-lg-2 col-md-3 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
              <LinkWidget title="Information" items={INFORMATION_LINKS} />
            </div>

            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
              <div className="footer-widget-items">
                <div className="footer-content">
                  <div className="footer-logo">
                    <Link href="/">
                      <Image
                        src="/assets/img/home-4/footer-logo.png"
                        alt="Crimson Deli"
                        width={232}
                        height={220}
                      />
                    </Link>
                  </div>
                  <p className="text">We believe it has the power to do amazing things.</p>
                  <h2>
                    <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                  </h2>
                  <div className="contact-items">
                    <a href={`mailto:${CONTACT.email}`}>
                      <i className="fa-regular fa-envelope"></i> {CONTACT.email}
                    </a>
                  </div>
                  <div className="contact-items">
                    <p>
                      <i className="fa-solid fa-location-dot"></i> {CONTACT.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-2 col-xl-3 col-lg-3 ps-xl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".6s">
              <LinkWidget
                title="Our Products"
                items={featured.map((p) => ({ label: p.name, href: `/shop-details?id=${p.id}` }))}
              />
            </div>

            <div className="col-xxl-2 col-xl-3 col-lg-4 ps-xxl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".8s">
              <LinkWidget title="Quick Links" items={QUICK_LINKS} />
            </div>
          </div>
        </div>

        <div className="footer-bottom style-3">
          <div className="footer-bottom-wrapper">
            <p>{COPYRIGHT}</p>
            <div className="app-image">
              <Image src="/assets/img/home-3/app.png" alt="Payment methods" width={304} height={25} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
