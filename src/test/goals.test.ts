import { describe, expect, it } from "vitest";
import { goalProgress, parseGoal } from "@/lib/goals";

describe("goals", () => {
  it("reads the lower bound of a range target", () => expect(parseGoal("3–6 months")).toBe(3));
  it("reads a single-number target", () => expect(parseGoal("under 36%")).toBe(36));
  it("returns null when the target has no number", () => expect(parseGoal("positive")).toBeNull());
  it("fills the ring by how much of the goal is met", () =>
    expect(Math.round(goalProgress(1.9, "months", "3–6 months")! * 100)).toBe(63));
  it("caps the fill at 100%", () => expect(goalProgress(7.4, "months", "3–6 months")).toBe(1));
  it("never fills below 0%", () => expect(goalProgress(-2, "months", "3–6 months")).toBe(0));
  it("compares percent values against percent targets", () =>
    expect(Math.round(goalProgress(0.47, "percent", "under 36%")! * 100)).toBe(100));
});
