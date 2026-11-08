// Data access layer. Components must read data only through these hooks.
// Swap the internals for real API calls later; signatures stay the same.
import { mockData } from "./mock";
import type { Account, Alert, Customer, Metric, MonthlyRecord, SpendingByCategory } from "./types";

export function useCustomer(): Customer {
  return mockData.customer;
}

export function useAccounts(): Account[] {
  return mockData.accounts;
}

export function useMonthly(): { months: MonthlyRecord[]; spendingByCategoryLastMonth: SpendingByCategory } {
  return { months: mockData.monthly, spendingByCategoryLastMonth: mockData.spendingByCategoryLastMonth };
}

export function useMetrics(): Metric[] {
  return mockData.metrics;
}

export function useAlerts(): Alert[] {
  return mockData.alerts;
}
