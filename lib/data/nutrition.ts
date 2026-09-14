import type { IceCreamSize } from "./food-menu";
import type { FoodItem, ItemMods, Nutrition } from "./types";

/** Label rows, in the order they print. */
export const NUTRITION_FIELDS: readonly { key: keyof Nutrition; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "" },
  { key: "totalFatG", label: "Total Fat", unit: "g" },
  { key: "saturatedFatG", label: "Saturated Fat", unit: "g" },
  { key: "cholesterolMg", label: "Cholesterol", unit: "mg" },
  { key: "totalCarbsG", label: "Total Carbs", unit: "g" },
  { key: "fiberG", label: "Fiber", unit: "g" },
  { key: "sugarG", label: "Sugar", unit: "g" },
  { key: "addedSugarG", label: "Added Sugar", unit: "g" },
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "sodiumMg", label: "Sodium", unit: "mg" },
  { key: "caffeineMg", label: "Caffeine", unit: "mg" },
];

export type NutritionResult = {
  facts: Nutrition;
  /** Changes the label could not count, e.g. `["No Onion"]`, because the store gave no numbers for them. */
  notCounted: string[];
};

/**
 * The label for what the customer has built: the item as normally made, less
 * what they took off, plus the extras they added.
 *
 * Null when the store has not given a label for this item (or this cup size),
 * so nothing is shown rather than an estimate. An ingredient without numbers
 * is left out of the sum and named in `notCounted`, never treated as zero.
 */
export function nutritionFor(
  item: Pick<FoodItem, "nutrition" | "nutritionLarge" | "ingredients">,
  choice: { size?: IceCreamSize; mods?: ItemMods },
): NutritionResult | null {
  const base = choice.size === "large" ? item.nutritionLarge : item.nutrition;
  if (!base) return null;

  const facts: Nutrition = { ...base };
  const notCounted: string[] = [];
  const ingredients = item.ingredients ?? [];

  const apply = (keys: string[], included: boolean, sign: 1 | -1, label: string) => {
    for (const key of keys) {
      const ingredient = ingredients.find((i) => i.key === key && i.included === included);
      if (!ingredient) continue;
      if (!ingredient.nutrition) {
        notCounted.push(`${label} ${ingredient.name}`);
        continue;
      }
      for (const { key: field } of NUTRITION_FIELDS) {
        facts[field] += sign * ingredient.nutrition[field];
      }
    }
  };
  apply(choice.mods?.removed ?? [], true, -1, "No");
  apply(choice.mods?.added ?? [], false, 1, "Add");

  // Taking off more than the store's numbers say the item holds can only mean
  // the numbers disagree; a label never shows a negative.
  for (const { key } of NUTRITION_FIELDS) {
    facts[key] = Math.max(0, Math.round(facts[key] * 10) / 10);
  }
  return { facts, notCounted };
}

/** `12` → "12", `0.5` → "0.5". */
export function formatNutritionValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
