import type { MockData } from "./types";

export const mockData: MockData = {
  customer: { id: "C024", name: "Demo Customer (C024)", asOf: "2026-10-31", creditLimit: 5332.24 },
  accounts: [
    { type: "checking", balance: 6122.85, yield: 0 },
    { type: "savings", balance: 12577.24, yield: 2.5 },
    { type: "ira", balance: 50025.78, yield: 3.5 },
    { type: "credit_card", balance: 9971.34, apr: 22.5, monthlyPayment: 299.14 },
    { type: "auto_loan", balance: 28908.09, apr: 7.5, monthlyPayment: 602.25 },
    { type: "personal_loan", balance: 13901.14, apr: 11.0, monthlyPayment: 386.14 },
    { type: "mortgage", balance: 281770.84, apr: 6.5, monthlyPayment: 1831.51 },
  ],
  monthly: [
    { month: "2025-11", income: 8344, spending: 6201, debtPayments: 4153, creditCardBalance: 9880, savingsBalance: 11954 },
    { month: "2025-12", income: 8353, spending: 6010, debtPayments: 4120, creditCardBalance: 9888, savingsBalance: 12002 },
    { month: "2026-01", income: 8356, spending: 5255, debtPayments: 3890, creditCardBalance: 9897, savingsBalance: 12072 },
    { month: "2026-02", income: 8510, spending: 5673, debtPayments: 3902, creditCardBalance: 9905, savingsBalance: 12132 },
    { month: "2026-03", income: 8531, spending: 5720, debtPayments: 4097, creditCardBalance: 9913, savingsBalance: 12190 },
    { month: "2026-04", income: 8259, spending: 5227, debtPayments: 3885, creditCardBalance: 9921, savingsBalance: 12252 },
    { month: "2026-05", income: 8542, spending: 5422, debtPayments: 4065, creditCardBalance: 9930, savingsBalance: 12307 },
    { month: "2026-06", income: 8473, spending: 5340, debtPayments: 3850, creditCardBalance: 9938, savingsBalance: 12365 },
    { month: "2026-07", income: 8559, spending: 5724, debtPayments: 3908, creditCardBalance: 9946, savingsBalance: 12410 },
    { month: "2026-08", income: 8337, spending: 5651, debtPayments: 3844, creditCardBalance: 9955, savingsBalance: 12453 },
    { month: "2026-09", income: 8461, spending: 5447, debtPayments: 4065, creditCardBalance: 9963, savingsBalance: 12501 },
    { month: "2026-10", income: 8557, spending: 5669, debtPayments: 4011, creditCardBalance: 9971, savingsBalance: 12577 },
  ],
  spendingByCategoryLastMonth: {
    dining: 312, groceries: 975, housing: 1990, other_spending: 884, shopping: 312, transport: 312, utilities: 884,
  },
  metrics: [
    { id: "emergency_fund", label: "Emergency fund", value: 1.9, unit: "months", status: "watch", target: "3–6 months", explanation: "Your checking and savings would cover about 1.9 months of spending and debt payments." },
    { id: "debt_to_income", label: "Debt-to-income", value: 0.47, unit: "percent", status: "risk", target: "under 36%", explanation: "About 47% of your monthly income goes to debt payments." },
    { id: "credit_utilization", label: "Credit card use", value: 1.87, unit: "percent", status: "risk", target: "under 30%", explanation: "Your card balance is 187% of your $5,332 limit. You are over the limit." },
    { id: "monthly_cash_flow", label: "Monthly cash flow", value: -1153, unit: "dollars", status: "risk", target: "positive", explanation: "On average, spending plus debt payments are about $1,150 more than income each month." },
  ],
  alerts: [
    { id: "a1", severity: "critical", title: "Card is over its limit", reason: "Balance $9,971 vs. limit $5,332.", suggestedAction: "Pay down the card before adding new purchases.", date: "2026-10-31", read: false, metricId: "credit_utilization", channels: ["app", "imessage"] },
    { id: "a2", severity: "warning", title: "Card balance rose 12 months in a row", reason: "Up from $9,880 to $9,971 since last November.", suggestedAction: "Paying $50 more per month would start shrinking it.", date: "2026-10-31", read: false, metricId: "credit_utilization", channels: ["app", "imessage"] },
    { id: "a3", severity: "info", title: "You paid $30 in fees this year", reason: "Card and loan servicing fees.", suggestedAction: "Ask the coach which fees can be avoided.", date: "2026-10-15", read: true, channels: ["app"] },
  ],
};
