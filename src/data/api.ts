// Data access layer. Components must read data only through these hooks.
// Swap the internals for real API calls later; signatures stay the same.
import { mockData } from "./mock";
import type { Account, Alert, ChatMessage, CoachReply, Customer, Metric, MonthlyRecord, SpendingByCategory } from "./types";

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

// Single replacement boundary for a future backend /api/chat call.
// Demo verification flags belong to these fixtures; no live verification runs here.
export async function sendCoachMessage(
  message: string,
  history: ChatMessage[],
  context?: { alertId?: string },
): Promise<CoachReply> {
  void history;
  await new Promise<void>((resolve) => setTimeout(resolve, 1200));
  const text = message.toLowerCase();
  // Alert context takes precedence over words occurring in an alert's title.
  if (text.includes("explain this alert")) {
    const alert = context?.alertId
      ? mockData.alerts.find((a) => a.id === context.alertId)
      : mockData.alerts.find((a) => text.includes(a.title.toLowerCase()));
    if (alert) return { reply: `${alert.reason} ${alert.suggestedAction}`, sources: ["Alerts"], verified: true };
  } else if (text.includes("credit") && /red|use|utilization/.test(text)) {
    return {
      reply: "Your card balance is $9,971 and your limit is $5,332. That's 187% of your limit, so you're over it. A healthy level is under 30%. Your balance has also grown every month this past year, from $9,880 to $9,971.",
      sources: ["Credit card use metric", "Monthly card balances"], verified: true,
    };
  } else if (/money go|spend|spending/.test(text)) {
    return {
      reply: "In October you spent $5,669. The biggest categories were housing ($1,990), groceries ($975), utilities ($884), and other spending ($884). Dining, shopping, and transport were $312 each.",
      sources: ["Spending by category, October 2026"], verified: true,
    };
  } else if (text.includes("income") && text.includes("debt")) {
    return {
      reply: "About 47% of your monthly income goes to debt payments. A common target is under 36%. Your largest monthly payment is the mortgage at $1,832, followed by the auto loan at $602.",
      sources: ["Debt-to-income metric", "Account list"], verified: true,
    };
  } else if (/\$50|50 more|pay more/.test(text)) {
    return {
      reply: "Right now your card balance grows by about $8 a month, because interest at 22.5% is a little more than what you pay down. Paying $50 more each month would flip that: the balance would start shrinking by roughly $40 a month at first.",
      sources: ["Credit card account", "Simulation: extra payment"], verified: true,
    };
  }
  return {
    reply: "I'm running in demo mode right now, so I can only answer a few questions. Try one of the suggested questions.",
    sources: [], verified: false,
  };
}
