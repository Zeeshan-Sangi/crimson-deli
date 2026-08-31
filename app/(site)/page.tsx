import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import FoodCard from "@/components/site/FoodCard";
import OfferSlider from "@/components/site/OfferSlider";
import { listAvailableProducts } from "@/lib/products/store";
import { formatHoursLine } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { siteConfig } from "@/lib/site-config";

const MAP_QUERY = encodeURIComponent(siteConfig.address);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export const metadata: Metadata = {
  description:
    "Hoagies, deli sandwiches, fruit bowls and smoothies made fresh at Crimson Deli on Ogontz Avenue. Order yours for pickup, or shop everyday essentials in-store and on DoorDash.",
};

const STEPS = [
  {
    badge: "Step-01",
    title: "Choose fresh food",
    body: "Browse the fresh food menu: hoagies, deli sandwiches, fruit bowls, smoothies, coffee and ice cream. Add what you want to your cart.",
  },
  {
    badge: "Step-02",
    title: "Checkout for pickup",
    body: "Leave your name and a phone number. There is no delivery address to fill in, because fresh food is collected in-store.",
  },
  {
    badge: "Step-03",
    title: "Pick up when ready",
    body: "We make it fresh at the counter and call you when it is ready to collect from Ogontz Avenue.",
  },
];

const WHY = [
  {
    title: "Made fresh in-store",
    note: "Hoagies, sandwiches, fruit bowls and smoothies are prepared at the counter when you order.",
    img: "/assets/img/crimson/products/deli-sandwich.webp",
    alt: "A Crimson Deli sandwich made fresh at the counter",
  },
  {
    title: "Pick up when it's ready",
    note: "There is no delivery slot to choose and no line to wait in. We call you as soon as your order is ready.",
    img: "/assets/img/crimson/products/fruit-bowl.webp",
    alt: "A fresh fruit bowl packed for pickup",
  },
  {
    title: "Your Ogontz Avenue deli",
    note: `One store at ${siteConfig.street}, with fresh food at the counter and everyday essentials on the shelves.`,
    img: "/assets/img/crimson/storefront-cover.webp",
    alt: "The Crimson Deli storefront on Ogontz Avenue",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const visible = await listAvailableProducts();
  const picks = visible.slice(0, 5);
  const { store } = await getSettings();
  const hoursLine = formatHoursLine(store.hours);

  return (
    <>
      <section className="cd-hero">
        <div className="cd-hero__inner">
          <p className="cd-hero__eyebrow wow fadeInUp" data-wow-delay="0.5s">
            Fresh made in-store · <strong>Pickup only</strong> at Ogontz Ave
          </p>
          <h1 className="cd-hero__title wow fadeInUp" data-wow-delay="0.7s">
            Order Fresh Food. Pick Up When Ready.
          </h1>
          <p className="cd-hero__lead wow fadeInUp" data-wow-delay="0.75s">
            Hoagies, sandwiches, fruit bowls, smoothies and more, all made at Crimson
            Deli. Fresh food is pickup only, and everyday essentials are delivered by
            DoorDash.
          </p>
          <div className="cd-hero__actions wow fadeInUp" data-wow-delay="0.8s">
            <Link href="/food" className="cd-btn-solid">
              Browse Fresh Food
            </Link>
            <a
              href={siteConfig.doordashUrl}
              target="_blank"
              rel="noopener"
              className="cd-btn-solid cd-btn-solid--ghost"
            >
              Essentials on DoorDash
            </a>
          </div>
          <span className="cd-hero__note">{siteConfig.address}</span>
        </div>
        <img
          src="/assets/img/home-1/chees-burger-hero.webp"
          alt=""
          aria-hidden="true"
          className="cd-hero__burger"
        />
        <img
          src="/assets/img/home-1/hero-burger-flower.webp"
          alt=""
          aria-hidden="true"
          className="cd-hero__deco cd-hero__deco--spin"
        />
      </section>

      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <div className="cd-split">
            <div>
              <img
                src="/assets/img/crimson/storefront-cover.webp"
                alt="Crimson Deli storefront"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <h3 className="wow fadeInUp" data-wow-delay=".5s">
                Crimson Deli on Ogontz Avenue
              </h3>
              <p className="wow fadeInUp" data-wow-delay=".6s">
                {siteConfig.address}
              </p>
              <p>{hoursLine}</p>
              <div className="cd-split__actions">
                <Link href="/food" className="cd-btn-solid">
                  Fresh Food · Pickup
                </Link>
                <Link href="/store" className="cd-btn-solid cd-btn-solid--ghost">
                  Essentials · DoorDash
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <OfferSlider visibleSlugs={visible.map((p) => p.slug)} />
        </div>
      </section>

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-section-head">
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              How to order?
            </h2>
            <p>
              Fresh food: browse, checkout, pick up in-store. Essentials: browse our
              catalog, then order on DoorDash.
            </p>
          </div>
          <div className="cd-step-grid">
            {STEPS.map((step, i) => (
              <div
                key={step.badge}
                className="cd-step-card wow fadeInUp"
                data-wow-delay={`0.${3 + i}s`}
              >
                <span className="cd-step-card__badge">{step.badge}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <div className="cd-section-head-row">
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Fresh picks
            </h2>
            <Link href="/food" className="cd-section-head__link">
              Full menu →
            </Link>
          </div>
          <div className="cd-food-grid">
            {picks.map((item, i) => (
              <FoodCard key={item.slug} item={item} delay={`0.${2 + (i % 3)}s`} />
            ))}
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <div className="cd-cta-split">
            <div className="cd-cta-split__copy">
              <span className="cd-cta-split__eyebrow">Two ways to order</span>
              <h3>
                Fresh food for pickup.
                <br />
                Essentials delivered.
              </h3>
              <p>
                Order deli favorites on our site and pick them up when they are ready.
                For everyday essentials, browse the catalog and check out on DoorDash.
              </p>
              <div className="cd-cta-split__actions">
                <Link href="/food" className="cd-btn-solid">
                  Order Fresh Food
                </Link>
                <a
                  href={siteConfig.doordashUrl}
                  target="_blank"
                  rel="noopener"
                  className="cd-btn-solid cd-btn-solid--ghost"
                >
                  Essentials · DoorDash
                </a>
              </div>
            </div>
            <div className="cd-cta-split__media">
              <img
                src="/assets/img/crimson/cta-order-ready.webp"
                alt="Fresh deli sandwich and fruit bowl from Crimson Deli"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-section-head">
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Why Crimson Deli
            </h2>
            <p>One store on Ogontz Avenue, two ways to get what you came for.</p>
          </div>
          <div className="cd-why-grid">
            {WHY.map((card, i) => (
              <article
                key={card.title}
                className="cd-why-card wow fadeInUp"
                data-wow-delay={`0.${3 + i}s`}
              >
                <img src={card.img} alt={card.alt} loading="lazy" decoding="async" />
                <div className="cd-why-card__shade" aria-hidden="true" />
                <h3 className="cd-why-card__text">
                  {card.title}
                  <span>{card.note}</span>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--white cd-visit">
        <iframe
          title={`Map to ${siteConfig.name}, ${siteConfig.address}`}
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="cd-visit__card-wrap">
          <div className="cd-visit__card">
            <h3 className="wow fadeInUp" data-wow-delay=".3s">
              Visit the store
            </h3>
            <ul className="cd-visit__list">
              <li>
                <MapPin size={19} aria-hidden="true" />
                <address>
                  <span>{siteConfig.street}</span>
                  <span>{siteConfig.cityStateZip}</span>
                </address>
              </li>
              <li>
                <Phone size={19} aria-hidden="true" />
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
              </li>
              <li>
                <Clock size={19} aria-hidden="true" />
                <span>{hoursLine}</span>
              </li>
            </ul>
            <div className="cd-visit__actions">
              <a href={MAP_DIRECTIONS} target="_blank" rel="noopener" className="cd-btn-solid">
                Get directions
              </a>
              <Link href="/contact" className="cd-btn-solid cd-btn-solid--ghost">
                Contact us
              </Link>
            </div>
            <p className="cd-visit__fine">
              Fresh food is collected in-store; we do not deliver deli orders. Everyday
              essentials are on the shelves here, or delivered through DoorDash.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
