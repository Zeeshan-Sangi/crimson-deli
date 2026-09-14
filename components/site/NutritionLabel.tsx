import { NUTRITION_FIELDS, formatNutritionValue, type NutritionResult } from "@/lib/data/nutrition";

/**
 * Nutrition facts for the item as the customer has built it. The numbers come
 * from the store; AddToCart recomputes them as ingredients go on and off.
 */
export default function NutritionLabel({
  result,
  sizeLabel,
  flavorsNotCounted,
}: {
  result: NutritionResult;
  /** e.g. "Large Cup", for items sold in two sizes. */
  sizeLabel?: string;
  /** Flavor choice changes what is in the cup, but the store gives one label. */
  flavorsNotCounted?: boolean;
}) {
  const { facts, notCounted } = result;
  const [calories, ...rows] = NUTRITION_FIELDS;

  return (
    <section className="cd-nutrition" aria-labelledby="cd-nutrition-title">
      <h3 id="cd-nutrition-title" className="cd-nutrition__title">
        Nutrition Facts
      </h3>
      {sizeLabel && <p className="cd-nutrition__serving">Per {sizeLabel.toLowerCase()}</p>}

      <div className="cd-nutrition__calories">
        <span>{calories.label}</span>
        {/* Announced when a change moves it, so a screen reader hears the
            effect of taking something off without hunting for the label. */}
        <strong aria-live="polite">{formatNutritionValue(facts.calories)}</strong>
      </div>

      <dl className="cd-nutrition__rows">
        {rows.map((field) => (
          <div key={field.key} className="cd-nutrition__row">
            <dt>{field.label}</dt>
            <dd>
              {formatNutritionValue(facts[field.key])}
              {field.unit}
            </dd>
          </div>
        ))}
      </dl>

      {notCounted.length > 0 && (
        <p className="cd-nutrition__note">
          Not counted, as the store has no figures for them yet: {notCounted.join(", ")}.
        </p>
      )}
      {flavorsNotCounted && (
        <p className="cd-nutrition__note">Figures are for the standard recipe; flavor choice is not counted.</p>
      )}
    </section>
  );
}
