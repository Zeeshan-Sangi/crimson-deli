"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css";

// Same five word-art plates the interim page cycles through, flower between each.
const PLATES = ["text1", "text2", "text3", "text4", "text5"];
const FLOWER = "/assets/img/home-2/text-slide-flower.png";

/**
 * Continuous text marquee — the `sponsor-text-slide` Swiper strip.
 * Speed 6000, delay 1, centered, auto width.
 *
 * Under `prefers-reduced-motion` the strip renders as a static row instead of
 * scrolling, per CLAUDE.md's animation rule.
 */
export default function TextMarquee() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Swiper needs roughly twice the visible slides to loop cleanly; ten wide
  // plates is not enough on a large screen, which is what it warns about. The
  // strip is a repeating marquee anyway, so duplicating the run is free.
  const oneRun = PLATES.flatMap((plate) => [
    `/assets/img/home-2/${plate}.png`,
    FLOWER,
  ]);
  const slides = [...oneRun, ...oneRun];

  if (reduced) {
    return (
      <section className="text-slider-section theme-bg py-3">
        <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
          {slides.map((src, i) => (
            <div key={i} className="text-slide-item rounded-3">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="text-slider-section theme-bg py-3">
      <Swiper
        className="sponsor-text-slide"
        modules={[Autoplay]}
        speed={6000}
        loop
        slidesPerView="auto"
        centeredSlides
        allowTouchMove={false}
        autoplay={{ delay: 1, disableOnInteraction: false }}
        spaceBetween={12}
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i} className="w-fit">
            <div className="text-slide-item rounded-3">
              <img src={src} alt="" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
