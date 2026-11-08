import type { Account, AccountDetail, Institution } from "./types";

export const pncInstitution: Institution = { id: "inst_pnc", name: "PNC Bank", source: "pnc", status: "synced", lastSynced: "2026-10-31T09:00:00" };
export const platypusInstitution: Institution = { id: "inst_platypus", name: "First Platypus Bank", source: "plaid", status: "synced", lastSynced: "" };
export const platypusAccounts: Account[] = [
  { id: "acct_plat_savings", institutionId: "inst_platypus", type: "savings", balance: 21131.81, yield: 2.5 },
  { id: "acct_plat_card", institutionId: "inst_platypus", type: "credit_card", balance: 6667.18, apr: 22.5, monthlyPayment: 200.02, creditLimit: 10095.97 },
];
export const platypusDetails: AccountDetail[] = [
  { id: "acct_plat_savings", institutionId: "inst_platypus", type: "savings", label: "High-yield savings", history: [20046,20145,20244,20344,20444,20535,20619,20712,20832,20924,21051,21132], recent: [{ date: "2026-09-30", label: "Interest earned", amount: 43.77 }, { date: "2026-10-05", label: "Savings transfer", amount: 18.27 }, { date: "2026-10-31", label: "Interest earned", amount: 43.93 }] },
  { id: "acct_plat_card", institutionId: "inst_platypus", type: "credit_card", label: "Platypus credit card", history: [6606,6612,6617,6623,6628,6634,6639,6645,6651,6656,6662,6667], recent: [{ date: "2026-10-19", label: "Dining", amount: 151.56 }, { date: "2026-10-25", label: "Shopping", amount: 151.56 }, { date: "2026-10-26", label: "Interest charged", amount: 124.91 }, { date: "2026-10-28", label: "Payment received", amount: -725.59 }], payoff: { months: 53, totalInterest: 3893, assumption: "Assumes no new purchases and a $200 payment every month. With current spending on the card, the balance is still rising." } },
];