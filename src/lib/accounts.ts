import type { Account, AccountDetail, MonthlyRecord } from "@/data/types";
import { formatMonth, formatUSD } from "@/lib/format";

export function isDebt(account: Account) {
  return !["checking", "savings", "ira"].includes(account.type);
}

export function accountSummary(accounts: Account[]) {
  return accounts.reduce((total, account) => ({
    assets: total.assets + (isDebt(account) ? 0 : account.balance),
    debts: total.debts + (isDebt(account) ? account.balance : 0),
    monthlyPayments: total.monthlyPayments + (account.monthlyPayment ?? 0),
  }), { assets: 0, debts: 0, monthlyPayments: 0 });
}

export function accountPresentation(account: Account, detail: AccountDetail, months: MonthlyRecord[]) {
  const debt = isDebt(account);
  const first = detail.history[0] ?? 0;
  const last = detail.history.at(-1) ?? first;
  const change = last - first;
  const good = debt ? change <= 0 : change >= 0;
  const limit = account.creditLimit ?? 0;
  const usage = limit > 0 ? Math.round(account.balance / limit * 100) : 0;
  return {
    ...account, ...detail, type: account.type, debt, change, good,
    changeLabel: `${formatUSD(Math.abs(change))} ${change < 0 ? "down" : "up"} over 12 months`,
    rateLabel: debt ? `${account.apr ?? 0}% APR · ${formatUSD(account.monthlyPayment ?? 0)}/month` : account.yield ? `${account.yield}% interest` : "No interest",
    chart: detail.history.map((balance, index) => ({ month: formatMonth(months[index]?.month ?? "2026-10"), balance })),
    usage, limit, usageWidth: `${Math.min(usage / 2, 100)}%`, limitWidth: "50%",
    usageLabel: `${usage}% of limit${usage > 100 ? ", over limit" : ""}`,
    payoffLabel: detail.payoff ? `${detail.payoff.months} months (about ${(detail.payoff.months / 12).toFixed(1)} years) at your current payment, about ${formatUSD(detail.payoff.totalInterest)} in interest.` : undefined,
    activity: detail.recent.map((item) => {
      const incoming = debt ? item.amount < 0 : item.amount > 0;
      return { ...item, incoming, displayLabel: debt && incoming ? "Payment received" : item.label, displayAmount: `${incoming ? "+" : "−"}${formatUSD(Math.abs(item.amount), true)}` };
    }),
  };
}

export type AccountView = ReturnType<typeof accountPresentation>;