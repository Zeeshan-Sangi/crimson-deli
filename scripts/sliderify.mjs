/**
 * Replace the template's Swiper markup with the React <Slider> component.
 *
 *   <div className="swiper hero-slider">
 *     <div className="swiper-wrapper">
 *       <div className="swiper-slide">…</div>
 *     </div>
 *   </div>
 *
 * becomes <Slider preset="hero-slider" slides={[{ content: <>…</> }]} />.
 *
 * Slides are handed over as data rather than as <SwiperSlide> children so the
 * SwiperSlide elements are constructed on the client (see slider.tsx).
 */
const PRESETS = new Set([
  "hero-slider",
  "galler-slider",
  "brand-slider-5",
  "testimonial-slider",
  "testimonial-slider-2",
  "testimonial-slider-3",
  "testimonial-slider-4",
]);

/** Index just past the </div> that closes the <div> starting at `start`. */
function endOfDiv(src, start) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === "</div>") {
      if (--depth === 0) return m.index + m[0].length;
    } else {
      depth += 1;
    }
  }
  return -1;
}

/** `className="a b" data-x=".3s"` -> { className: "a b", "data-x": ".3s" } */
function parseAttrs(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([A-Za-z-]+)="([^"]*)"/g)) attrs[m[1]] = m[2];
  return attrs;
}

function objectLiteral(attrs) {
  const parts = Object.entries(attrs).map(
    ([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(v)}`,
  );
  return `{ ${parts.join(", ")} }`;
}

export function sliderify(src) {
  let out = "";
  let cursor = 0;
  let count = 0;

  const OPEN = /<div className="swiper ([a-z0-9-]+)"([^>]*)>/g;
  let m;
  while ((m = OPEN.exec(src))) {
    const preset = m[1];
    if (!PRESETS.has(preset)) continue;

    const blockEnd = endOfDiv(src, m.index);
    if (blockEnd === -1) continue;
    const block = src.slice(m.index, blockEnd);

    const wrapMatch = /<div className="swiper-wrapper[^"]*"[^>]*>/.exec(block);
    if (!wrapMatch) continue;
    const wrapEnd = endOfDiv(block, wrapMatch.index);
    const slidesHtml = block.slice(wrapMatch.index + wrapMatch[0].length, wrapEnd - "</div>".length);

    // Collect each .swiper-slide with its attributes and inner content.
    const slides = [];
    const SLIDE = /<div className="swiper-slide([^"]*)"([^>]*)>/g;
    let s;
    while ((s = SLIDE.exec(slidesHtml))) {
      const slideEnd = endOfDiv(slidesHtml, s.index);
      if (slideEnd === -1) break;
      const content = slidesHtml.slice(s.index + s[0].length, slideEnd - "</div>".length);
      const attrs = parseAttrs(s[0]);
      const extra = (s[1] || "").trim();
      if (extra) attrs.className = extra;
      else delete attrs.className;
      slides.push({ attrs, content });
      SLIDE.lastIndex = slideEnd;
    }
    if (slides.length === 0) continue;

    const extraClasses = (m[2].match(/className="([^"]*)"/) || [])[1];
    const body = slides
      .map(({ attrs, content }) => {
        const props = Object.keys(attrs).length ? `props: ${objectLiteral(attrs)}, ` : "";
        return `        { ${props}content: (\n          <>\n${content.trimEnd()}\n          </>\n        ) },`;
      })
      .join("\n");

    out += src.slice(cursor, m.index);
    out +=
      `<Slider\n      preset="${preset}"\n` +
      (extraClasses ? `      className="${extraClasses}"\n` : "") +
      `      slides={[\n${body}\n      ]}\n    />`;
    cursor = blockEnd;
    count += 1;
    OPEN.lastIndex = blockEnd;
  }

  out += src.slice(cursor);
  return { code: out, count };
}

export const SLIDER_IMPORT = 'import Slider from "@/components/ui/slider";';
