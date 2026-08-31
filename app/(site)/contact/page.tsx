import type { Metadata } from "next";
import Breadcrumb from "@/components/site/Breadcrumb";
import ContactForm from "@/components/site/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { formatHoursLine } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { Clock, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call Crimson Deli on ${siteConfig.phone}, email ${siteConfig.email}, or visit us at ${siteConfig.address}.`,
};

const MAP_URL =
  "https://maps.google.com/?q=7720+Ogontz+Avenue+Philadelphia+PA+19150";

export default async function ContactPage() {
  const { store } = await getSettings();
  const hoursLine = formatHoursLine(store.hours);

  return (
    <>
      <Breadcrumb title="Contact" trail={[{ label: "Contact" }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-contact-layout">
            <div>
              <div className="cd-section-head cd-section-head--left">
                <h2>Get in touch</h2>
                <p>
                  Questions about a pickup order, something on the fresh food menu, or what
                  we have on the shelves? Send us a message and we will get back to you.
                  For anything urgent, calling the store is fastest.
                </p>
              </div>
              <ContactForm />
            </div>

            <div className="cd-contact-card">
              <div className="cd-contact-card__image">
                <img
                  src="/assets/img/crimson/storefront-cover.webp"
                  alt="Crimson Deli storefront on Ogontz Avenue"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="cd-contact-card__body">
                <h3>{siteConfig.name}</h3>
                <p>{siteConfig.address}</p>

                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener"
                  className="cd-contact-map-link"
                >
                  View on map
                </a>

                <div className="cd-contact-links">
                  <a href={`mailto:${siteConfig.email}`}>
                    <Mail size={16} aria-hidden="true" /> {siteConfig.email}
                  </a>
                  <a href={siteConfig.phoneHref}>
                    <Phone size={16} aria-hidden="true" /> {siteConfig.phone}
                  </a>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "var(--cd-ink)" }}>
                    <Clock size={16} aria-hidden="true" style={{ color: "var(--cd-crimson)" }} /> {hoursLine}
                  </span>
                </div>

                <p className="cd-product__fine">
                  Fresh food is pickup only, so collect it at the counter. Everyday
                  essentials are on our shelves in-store, or order them for delivery on{" "}
                  <a
                    href={siteConfig.doordashUrl}
                    target="_blank"
                    rel="noopener"
                    style={{ color: "var(--cd-crimson)", fontWeight: 700 }}
                  >
                    DoorDash
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
