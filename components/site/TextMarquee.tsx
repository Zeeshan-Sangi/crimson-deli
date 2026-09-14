import "./text-marquee.css";

const FLOWER = "/assets/img/home-2/text-slide-flower.png";

/** What the store actually is. Nothing here may promise delivery of fresh food. */
const PHRASES = [
  "Made fresh at the counter",
  "Pickup only on Ogontz Avenue",
  "Hoagies, sandwiches and fruit bowls",
  "Smoothies, coffee and ice cream",
  "Everyday essentials on DoorDash",
];

/**
 * The crimson strip on the About page: the store's own lines, scrolling.
 *
 * It replaces the template's word-art PNGs, which were 14px tall, blurred when
 * scaled and advertised things the store never said ("we deliver", "100% extra
 * preservative free"). The run is rendered twice and slid by half its width, so
 * the loop has no seam and no gap at the end; CSS drives it, so there is no
 * script, and reduced-motion users see it standing still.
 */
export default function TextMarquee() {
  return (
    <section className="cd-marquee" aria-label="About Crimson Deli">
      <div className="cd-marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="cd-marquee__run" aria-hidden={copy === 1 || undefined}>
            {PHRASES.map((phrase) => (
              <li key={phrase}>
                <span>{phrase}</span>
                <img src={FLOWER} alt="" width={20} height={20} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
