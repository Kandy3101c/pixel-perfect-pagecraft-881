import type { MonthlyRecord } from "@/data/types";

export function debtToIncomeHistory(months: MonthlyRecord[]) {
  return [...months]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, income, debtCosts }) => ({
      month,
      ratio: income > 0 ? debtCosts / income : null,
    }));
}