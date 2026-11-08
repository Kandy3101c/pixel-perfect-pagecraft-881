import type { AccountDetail, MockData } from "./types";

export const mockData: MockData = {
  customer: { id: "C024", name: "Demo Customer (C024)", asOf: "2026-10-31", creditLimit: 5332.24 },
  accounts: [
    { id: "acct_pnc_checking", institutionId: "inst_pnc", type: "checking", balance: 6122.85, yield: 0 },
    { id: "acct_pnc_savings", institutionId: "inst_pnc", type: "savings", balance: 12577.24, yield: 2.5 },
    { id: "acct_pnc_ira", institutionId: "inst_pnc", type: "ira", balance: 50025.78, yield: 3.5 },
    { id: "acct_pnc_card", institutionId: "inst_pnc", type: "credit_card", balance: 9971.34, creditLimit: 5332.24, apr: 22.5, monthlyPayment: 299.14 },
    { id: "acct_pnc_auto", institutionId: "inst_pnc", type: "auto_loan", balance: 28908.09, apr: 7.5, monthlyPayment: 602.25 },
    { id: "acct_pnc_personal", institutionId: "inst_pnc", type: "personal_loan", balance: 13901.14, apr: 11.0, monthlyPayment: 386.14 },
    { id: "acct_pnc_mortgage", institutionId: "inst_pnc", type: "mortgage", balance: 281770.84, apr: 6.5, monthlyPayment: 1831.51 },
  ],
  monthly: [
    { month: "2025-11", income: 8344, spending: 6201, debtCosts: 2797, creditCardBalance: 9880, savingsBalance: 11954 },
    { month: "2025-12", income: 8353, spending: 6010, debtCosts: 2806, creditCardBalance: 9888, savingsBalance: 12002 },
    { month: "2026-01", income: 8356, spending: 5255, debtCosts: 2742, creditCardBalance: 9897, savingsBalance: 12072 },
    { month: "2026-02", income: 8510, spending: 5673, debtCosts: 2662, creditCardBalance: 9905, savingsBalance: 12132 },
    { month: "2026-03", income: 8531, spending: 5720, debtCosts: 2847, creditCardBalance: 9913, savingsBalance: 12190 },
    { month: "2026-04", income: 8259, spending: 5227, debtCosts: 2758, creditCardBalance: 9921, savingsBalance: 12252 },
    { month: "2026-05", income: 8542, spending: 5422, debtCosts: 2881, creditCardBalance: 9930, savingsBalance: 12307 },
    { month: "2026-06", income: 8473, spending: 5340, debtCosts: 2684, creditCardBalance: 9938, savingsBalance: 12365 },
    { month: "2026-07", income: 8559, spending: 5724, debtCosts: 2657, creditCardBalance: 9946, savingsBalance: 12410 },
    { month: "2026-08", income: 8337, spending: 5651, debtCosts: 2610, creditCardBalance: 9955, savingsBalance: 12453 },
    { month: "2026-09", income: 8461, spending: 5447, debtCosts: 2875, creditCardBalance: 9963, savingsBalance: 12501 },
    { month: "2026-10", income: 8557, spending: 5669, debtCosts: 2773, creditCardBalance: 9971, savingsBalance: 12577 },
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


export const accountDetails: AccountDetail[] = [
 {"id":"acct_pnc_checking","institutionId":"inst_pnc","type":"checking","label":"Checking","history":[7274,6600,6056,5004,6164,7028,6270,6113,6380,6560,5512,6123],"recent":[{"date":"2026-10-21","label":"Mortgage payment","amount":-2062.96},{"date":"2026-10-25","label":"Other spending","amount":-884.35},{"date":"2026-10-28","label":"Credit card payment","amount":-1425.62}]},
 {"id":"acct_pnc_savings","institutionId":"inst_pnc","type":"savings","label":"Savings","history":[11954,12002,12072,12132,12190,12252,12307,12365,12410,12453,12501,12577],"recent":[{"date":"2026-10-01","label":"Paycheck deposit","amount":25.05},{"date":"2026-10-05","label":"Savings transfer","amount":25.05},{"date":"2026-10-31","label":"Interest earned","amount":26.15}]},
 {"id":"acct_pnc_ira","institutionId":"inst_pnc","type":"ira","label":"IRA (retirement)","history":[46856,47137,47439,47667,47906,48150,48441,48777,49089,49428,49737,50026],"recent":[{"date":"2026-09-30","label":"Interest earned","amount":144.65},{"date":"2026-10-05","label":"Contribution","amount":142.94},{"date":"2026-10-31","label":"Interest earned","amount":145.48}]},
 {"id":"acct_pnc_card","institutionId":"inst_pnc","type":"credit_card","label":"Credit card","history":[9880,9888,9897,9905,9913,9921,9930,9938,9946,9955,9963,9971],"recent":[{"date":"2026-10-19","label":"Dining","amount":311.78},{"date":"2026-10-25","label":"Shopping","amount":311.78},{"date":"2026-10-26","label":"Interest charged","amount":186.81},{"date":"2026-10-28","label":"Payment received","amount":-1425.62}],"payoff":{"months":53,"totalInterest":5823,"assumption":"Assumes no new purchases and a $299 payment every month. With your current spending on the card, the balance is still rising."}},
 {"id":"acct_pnc_auto","institutionId":"inst_pnc","type":"auto_loan","label":"Auto loan","history":[30565,30429,30249,30103,29930,29797,29656,29492,29380,29222,29038,28908],"recent":[{"date":"2026-09-21","label":"Payment","amount":-366.42},{"date":"2026-10-20","label":"Interest charged","amount":181.49},{"date":"2026-10-21","label":"Payment","amount":-311.40}],"payoff":{"months":57,"totalInterest":5569,"assumption":"Assumes the scheduled $602 payment every month."}},
 {"id":"acct_pnc_personal","institutionId":"inst_pnc","type":"personal_loan","label":"Personal loan","history":[14897,14809,14730,14648,14551,14480,14359,14262,14179,14102,13984,13901],"recent":[{"date":"2026-09-21","label":"Payment","amount":-246.65},{"date":"2026-10-20","label":"Interest charged","amount":128.19},{"date":"2026-10-21","label":"Payment","amount":-211.34}],"payoff":{"months":44,"totalInterest":3046,"assumption":"Assumes the scheduled $386 payment every month."}},
 {"id":"acct_pnc_mortgage","institutionId":"inst_pnc","type":"mortgage","label":"Mortgage","history":[286858,286343,285922,285547,285026,284551,283979,283598,283188,282848,282305,281771],"recent":[{"date":"2026-09-21","label":"Payment","amount":-2075.26},{"date":"2026-10-20","label":"Interest charged","amount":1529.15},{"date":"2026-10-21","label":"Payment","amount":-2062.96}],"payoff":{"months":332,"totalInterest":325707,"assumption":"Assumes the scheduled $1,832 payment every month."}}
];
