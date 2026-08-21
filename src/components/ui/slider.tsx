"use client";

import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SLIDER_PRESETS, type SliderPreset } from "@/data/sliders";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/**
 * React replacement for the template's jQuery-constructed Swiper instances.
 *
 * Slides arrive as an array rather than as <SwiperSlide> children so the
 * SwiperSlide elements are always created on the client; that keeps Swiper's
 * child-type detection working when a Server Component renders the slider.
 */
export type Slide = {
  /** Extra attributes the template put on the .swiper-slide (wow classes etc.). */
  props?: Record<string, unknown>;
  content: React.ReactNode;
};

export default function Slider({
  preset,
  slides,
  className,
}: {
  preset: SliderPreset;
  slides: Slide[];
  className?: string;
}) {
  return (
    <Swiper
      {...SLIDER_PRESETS[preset]}
      modules={[Autoplay, EffectFade, Navigation, Pagination]}
      className={className ?? preset}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i} {...(slide.props ?? {})}>
          {slide.content}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
