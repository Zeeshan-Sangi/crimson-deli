import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/site/Breadcrumb";
import TextMarquee from "@/components/site/TextMarquee";
import { siteConfig } from "@/lib/site-config";
import { summariseHours } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

export const metadata: Metadata = {
  title: "About",
  description:
    "Crimson Deli on Ogontz Avenue serves fresh food made in-store for pickup, plus everyday essentials in-store or delivered on DoorDash.",
};

const lanes = [
  {
    title: "Made fresh in-store",
    body: "Hoagies, deli sandwiches, fruit bowls, smoothies and coffee, all prepared at our Ogontz Avenue counter rather than shipped in.",
    href: "/food",
  },
  {
    title: "Fresh food is pickup only",
    body: "Order fresh food here and collect it at the counter when it is ready. We do not deliver fresh food.",
    href: "/food",
  },
  {
    title: "Essentials, two ways",
    body: "Snacks, drinks, dairy and household items are on the shelves in-store, or you can order them for delivery on DoorDash.",
    href: "/store",
  },
];

export default async function AboutPage() {
  const { store } = await getSettings();
  const hourGroups = summariseHours(store.hours);

  return (
    <>
      <Breadcrumb title="About" trail={[{ label: "About" }]} />

      <section className="cd-section cd-section--white">
        <div className="cd-page-wrap">
          <div className="cd-about-split">
            <div className="cd-about-split__photo">
              <img
                src="/assets/img/crimson/storefront-cover.webp"
                alt="Crimson Deli storefront on Ogontz Avenue"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <span className="cd-section-head__eyebrow">Quality service</span>
              <h2>About Crimson Deli</h2>
              <p>
                Crimson Deli on Ogontz Avenue is a neighborhood store for fresh-made food
                and everyday essentials. Order deli subs, fruit bowls, and smoothies for
                pickup on our site. Browse snacks, drinks, and household items, then order
                delivery on DoorDash.
              </p>

              <div className="cd-about-secondary">
                <div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Opening hours</h3>
                  <p>One store, two lanes: fresh food pickup here, essentials via DoorDash.</p>
                  <ul className="cd-hours-list">
                    {hourGroups.map((group) => (
                      <li key={group.days}>
                        <span>{group.days}</span>
                        <span>{group.hours}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="cd-btn-solid cd-btn-solid--ghost">
                    Contact us
                  </Link>
                </div>
                <div className="cd-about-split__photo">
                  <img
                    src="/assets/img/crimson/products/deli-burger.webp"
                    alt="Hoagie made fresh in-store"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <TextMarquee />
        </div>
      </section>

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-lane-grid">
            {lanes.map((lane) => (
              <article key={lane.title} className="cd-lane-card">
                <h3>
                  <Link href={lane.href}>{lane.title}</Link>
                </h3>
                <p>{lane.body}</p>
              </article>
            ))}
          </div>

          <div className="cd-about-cta">
            <p>
              Questions about an order? Call the store on{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
            </p>
            <Link href="/food" className="cd-btn-solid">
              Browse fresh food
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
