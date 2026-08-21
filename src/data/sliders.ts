/**
 * Swiper configs, lifted verbatim from the template's main.js.
 *
 * Navigation/pagination still reference the template's global CSS selectors
 * (.array-next, .dot, .dots …) because those controls live outside the slider
 * markup — exactly as the jQuery version expected.
 *
 * Note: testimonial-slider-3 really does map prev->.array-next and
 * next->.array-prev; that swap is in the original template and is preserved.
 */
import type { SwiperOptions } from "swiper/types";

export const SLIDER_PRESETS = {
  "hero-slider": {
    loop: true,
    speed: 1000,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: { delay: 4000, disableOnInteraction: false },
    navigation: { nextEl: ".array-next", prevEl: ".array-prev" },
    pagination: { el: ".dot", clickable: true },
  },
  "galler-slider": {
    loop: true,
    slidesPerView: 1,
    centeredSlides: false,
    allowTouchMove: false,
    speed: 5000,
    spaceBetween: 20,
    autoplay: { delay: 1, disableOnInteraction: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 3 },
    },
    a11y: { enabled: false },
    navigation: { prevEl: ".tp-testimonial-prev", nextEl: ".tp-testimonial-next" },
  },
  "brand-slider-5": {
    spaceBetween: 24,
    speed: 1300,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    breakpoints: {
      0: { slidesPerView: 1 },
      400: { slidesPerView: 2 },
      575: { slidesPerView: 3 },
      767: { slidesPerView: 4 },
      991: { slidesPerView: 5 },
      1199: { slidesPerView: 6 },
    },
  },
  "testimonial-slider": {
    spaceBetween: 30,
    speed: 1300,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    pagination: { el: ".dots", clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
      575: { slidesPerView: 1 },
      767: { slidesPerView: 2 },
      991: { slidesPerView: 2 },
      1199: { slidesPerView: 3 },
    },
  },
  "testimonial-slider-2": {
    spaceBetween: 30,
    speed: 1300,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    navigation: { nextEl: ".array-nexts", prevEl: ".array-prevs" },
  },
  "testimonial-slider-3": {
    spaceBetween: 30,
    speed: 1300,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    navigation: { nextEl: ".array-prev", prevEl: ".array-next" },
    breakpoints: {
      0: { slidesPerView: 1 },
      575: { slidesPerView: 1 },
      767: { slidesPerView: 1 },
      991: { slidesPerView: 1 },
      1199: { slidesPerView: 2 },
    },
  },
  "testimonial-slider-4": {
    spaceBetween: 30,
    speed: 1300,
    centeredSlides: true,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    breakpoints: {
      0: { slidesPerView: 1 },
      575: { slidesPerView: 1 },
      767: { slidesPerView: 2, centeredSlides: false },
      991: { slidesPerView: 2 },
      1199: { slidesPerView: 3 },
    },
  },
} satisfies Record<string, SwiperOptions>;

export type SliderPreset = keyof typeof SLIDER_PRESETS;
