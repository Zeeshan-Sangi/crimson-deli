"use client";

import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const OFFERS = [
  {
    slug: "deli-burger",
    img: "/assets/img/crimson/offers/offer-deli-burger.webp",
    alt: "Hoagie, available for pickup at Crimson Deli",
  },
  {
    slug: "deli-sandwich",
    img: "/assets/img/crimson/offers/offer-deli-sandwich.webp",
    alt: "Deli Sandwich, made fresh daily at Crimson Deli",
  },
  {
    slug: "fruit-bowl",
    img: "/assets/img/crimson/offers/offer-fruit-bowl.webp",
    alt: "Fresh Fruit Bowl, available to order at Crimson Deli",
  },
];

export default function OfferSlider({ visibleSlugs }: { visibleSlugs: string[] }) {
  const offers = OFFERS.filter((o) => visibleSlugs.includes(o.slug));
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
      {offers.map((offer, i) => (
        <SwiperSlide key={offer.slug}>
          <Link
            href={`/food/${offer.slug}`}
            className="cd-offer-card wow fadeInUp"
            data-wow-delay={`0.${3 + i}s`}
          >
            <img src={offer.img} alt={offer.alt} loading="lazy" decoding="async" />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
