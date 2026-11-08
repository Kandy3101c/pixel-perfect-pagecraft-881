export const formatUSD = (n: number, cents = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);

export const formatPct = (d: number) => `${Math.round(d * 100)}%`;

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export const formatMonth = (ym: string) =>
  new Date(ym + "-01T00:00:00").toLocaleDateString("en-US", { month: "short", year: "2-digit" });

const LABELS: Record<string, string> = {
  other_spending: "Other",
  credit_card: "Credit card",
  auto_loan: "Auto loan",
  personal_loan: "Personal loan",
  ira: "IRA",
};

export const humanize = (key: string) =>
  LABELS[key] ?? key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
