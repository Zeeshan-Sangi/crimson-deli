"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Offer = {
  slug: string;
  img: string;
  alt: string;
  /** Fresh-food offers link to their menu page and drop out when the item is hidden. */
  food?: boolean;
  /** Overrides the default link, for posters that cover a whole menu section. */
  href?: string;
};

const OFFERS: Offer[] = [
  {
    slug: "deli-burger",
    img: "/assets/img/crimson/offers/offer-deli-burger.webp",
    alt: "Hoagie, available for pickup at Crimson Deli",
    food: true,
  },
  {
    slug: "deli-sandwich",
    img: "/assets/img/crimson/offers/offer-deli-sandwich.png",
    alt: "Deli Sandwich, made fresh daily at Crimson Deli",
    food: true,
  },
  {
    slug: "fruit-bowl",
    img: "/assets/img/crimson/offers/offer-fruit-bowl.webp",
    alt: "Fresh Fruit Bowl, available to order at Crimson Deli",
    food: true,
  },
  {
    slug: "water-ice",
    img: "/assets/img/crimson/offers/offer-water-ice.webp",
    alt: "Philadelphia Water Ice in every flavor at Crimson Deli",
    food: true,
  },
  {
    slug: "ice-cream",
    img: "/assets/img/crimson/offers/offer-ice-cream.webp",
    alt: "Ice cream cups, small $3.99 and large $4.99 at Crimson Deli",
    href: "/food#ice-cream",
  },
  // In-store drink deals. Each poster opens its own department on /store.
  {
    slug: "ryl-iced-tea",
    img: "/assets/img/crimson/offers/offer-ryl-iced-tea.webp",
    alt: "The Ryl Co. iced tea, 1 for $2.69 or 2 for $5 at Crimson Deli",
  },
  {
    slug: "vinut-juice",
    img: "/assets/img/crimson/offers/offer-vinut-juice.webp",
    alt: "Vinut 100% mango, sugarcane and lychee juice, $5 at Crimson Deli",
  },
  {
    slug: "vivo-cans",
    img: "/assets/img/crimson/offers/offer-vivo-cans.webp",
    alt: "Vivo mango and peach fruit drink cans, 1 for $2.09 or 2 for $3.50 at Crimson Deli",
  },
  {
    slug: "vivo-bottles",
    img: "/assets/img/crimson/offers/offer-vivo-bottles.webp",
    alt: "Vivo guava, peach and mango fruit drink bottles, 1 for $2.99 or 2 for $5 at Crimson Deli",
  },
];

export default function OfferSlider({ visibleSlugs }: { visibleSlugs: string[] }) {
  const offers = OFFERS.filter((o) => !o.food || visibleSlugs.includes(o.slug));
  if (offers.length === 0) return null;

  return (
    <Swiper
      className="cd-offer-slider"
      modules={[Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      loop={offers.length > 3}
      autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      breakpoints={{ 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}
    >
      {offers.map((offer) => {
        // The posters are not all 2:3; the card keeps one shape and fills any
        // gap with a blurred copy of the same poster.
        const style = { "--offer-img": `url(${offer.img})` } as CSSProperties;
        const img = <img src={offer.img} alt={offer.alt} loading="eager" />;
        return (
          <SwiperSlide key={offer.slug}>
            <Link
              href={
                offer.href ?? (offer.food ? `/food/${offer.slug}` : `/store/${offer.slug}`)
              }
              className="cd-offer-card"
              style={style}
            >
              {img}
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
