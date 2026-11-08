import type { Metric } from "@/data/types";

// How much of a metric's target has been reached, as a 0..1 share.
// Used to fill the circular progress bar on the first health card.

const NUMBER = /\d+(?:\.\d+)?/;

/** The number a target aims at: "3–6 months" -> 3, "under 36%" -> 36, "positive" -> null. */
export function parseGoal(target: string): number | null {
  const match = target.match(NUMBER);
  return match ? Number(match[0]) : null;
}

/** Share of the goal already met, clamped to 0..1. Null when the target has no number to aim at. */
export function goalProgress(value: number, unit: Metric["unit"], target: string): number | null {
  const goal = parseGoal(target);
  if (goal === null || goal === 0) return null;
  // Percent metrics store the value as a decimal (0.47) while their target is written as 36.
  const shown = unit === "percent" ? value * 100 : value;
  return Math.min(1, Math.max(0, shown / goal));
}
