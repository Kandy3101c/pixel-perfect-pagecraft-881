import { describe, expect, it } from "vitest";
import { debtToIncomeHistory } from "@/lib/debt-to-income";
import type { MonthlyRecord } from "@/data/types";

const month = (date: string, income: number, debtCosts: number): MonthlyRecord => ({
  month: date, income, debtCosts, spending: 0, creditCardBalance: 0, savingsBalance: 0,
});

describe("debt-to-income history", () => {
  it("calculates monthly debt payments as a share of that month's income", () => {
    expect(debtToIncomeHistory([month("2026-10", 8557, 4011)])[0]?.ratio).toBeCloseTo(0.468739, 6);
  });

  it("keeps every month in chronological order without changing the input", () => {
    const months = [month("2026-02", 8000, 4000), month("2026-01", 10000, 3000)];
    expect(debtToIncomeHistory(months)).toEqual([
      { month: "2026-01", ratio: 0.3 }, { month: "2026-02", ratio: 0.5 },
    ]);
    expect(months[0]?.month).toBe("2026-02");
  });

  it("leaves a gap when income is unavailable rather than plotting a false zero", () => {
    expect(debtToIncomeHistory([month("2026-01", 0, 3000)])[0]?.ratio).toBeNull();
  });
});