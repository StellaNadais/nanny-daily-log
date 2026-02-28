import foodTaxonomy from '../data/foodTaxonomy.json';

export type FoodSegment = { type: 'text'; content: string } | { type: 'food'; content: string; color: string };

type FoodEntry = { name: string; color: string; category: string };
const foodsByLength = [...(foodTaxonomy.foods as FoodEntry[])].sort(
  (a, b) => b.name.length - a.name.length
);

/**
 * Splits text into segments, with known food names marked and assigned their taxonomy color.
 * Longest names are matched first so "cottage cheese" matches before "cheese".
 */
export function colorizeFoodText(text: string): FoodSegment[] {
  if (!text.trim()) return [{ type: 'text', content: text }];

  const segments: FoodSegment[] = [];
  const lower = text.toLowerCase();
  let i = 0;

  while (i < text.length) {
    let matched = false;
    for (const food of foodsByLength) {
      const name = food.name.toLowerCase();
      if (lower.slice(i, i + name.length) === name) {
        const content = text.slice(i, i + name.length);
        segments.push({ type: 'food', content, color: food.color });
        i += name.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      segments.push({ type: 'text', content: text[i] });
      i += 1;
    }
  }

  return segments;
}

export const foodColors = foodTaxonomy.colors as Record<string, string>;

/** Count food mentions in text by category. Composite categories (e.g. grain+protein) add 1 to each. */
export function getFoodCountsFromText(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const lower = text.toLowerCase();
  let i = 0;
  const seen = new Set<string>(); // avoid double-counting overlapping matches

  while (i < lower.length) {
    let matched = false;
    for (const food of foodsByLength) {
      const name = food.name.toLowerCase();
      const end = i + name.length;
      if (lower.slice(i, end) === name && !seen.has(`${i}-${end}`)) {
        seen.add(`${i}-${end}`);
        const cats = food.category.split('+').map((c) => c.trim());
        for (const cat of cats) {
          if (cat && cat !== 'other') {
            counts[cat] = (counts[cat] ?? 0) + 1;
          }
        }
        i += name.length;
        matched = true;
        break;
      }
    }
    if (!matched) i += 1;
  }
  return counts;
}

export type IntakeStats = Record<string, number>;

/** Aggregate intake by category from meal notes over the last N days. */
export function getIntakeStats(
  mealNotes: { date: string; notes: string }[],
  lastNDays: number = 7
): IntakeStats {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lastNDays);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const total: Record<string, number> = {};
  for (const note of mealNotes) {
    if (note.date >= cutoffISO && note.notes?.trim()) {
      const counts = getFoodCountsFromText(note.notes);
      for (const [cat, n] of Object.entries(counts)) {
        total[cat] = (total[cat] ?? 0) + n;
      }
    }
  }
  return total;
}

export const CATEGORY_LABELS: Record<string, string> = {
  fruit: 'Fruit',
  vegetable: 'Vegetables',
  grain: 'Grains',
  protein: 'Protein',
  dairy: 'Dairy',
  fat_other: 'Fats & other',
};

/** Suggest category keys to eat more of (under-represented or zero). Returns e.g. ['vegetable', 'protein']. */
export function getEatMoreCategoryKeys(stats: IntakeStats): string[] {
  const categories = Object.keys(CATEGORY_LABELS);
  const withCounts = categories.map((c) => ({ category: c, count: stats[c] ?? 0 }));
  const maxCount = Math.max(1, ...withCounts.map((x) => x.count));
  const threshold = Math.max(0, Math.floor(maxCount * 0.4)); // suggest if below 40% of max
  return withCounts.filter((x) => x.count <= threshold).map((x) => x.category);
}

