import type { MonthlyRecord } from "@/data/types";

export function debtToIncomeHistory(months: MonthlyRecord[]) {
  return [...months]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, income, debtPayments }) => ({
      month,
      ratio: income > 0 ? debtPayments / income : null,
    }));
}