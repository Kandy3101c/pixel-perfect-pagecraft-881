export type AssetType = "checking" | "savings" | "ira";
export type DebtType = "credit_card" | "auto_loan" | "personal_loan" | "mortgage";
export type AccountType = AssetType | DebtType;

export interface Customer {
  id: string;
  name: string;
  asOf: string;
  creditLimit: number;
}

export interface Account {
  type: AccountType;
  balance: number;
  yield?: number;
  apr?: number;
  monthlyPayment?: number;
}

export interface MonthlyRecord {
  month: string;
  income: number;
  spending: number;
  debtPayments: number;
  creditCardBalance: number;
  savingsBalance: number;
}

export type SpendingByCategory = Record<string, number>;

export type MetricStatus = "good" | "watch" | "risk";
export type MetricUnit = "months" | "percent" | "dollars";

export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: MetricUnit;
  status: MetricStatus;
  target: string;
  explanation: string;
}

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  reason: string;
  suggestedAction: string;
  date: string;
  read: boolean;
}

export interface MockData {
  customer: Customer;
  accounts: Account[];
  monthly: MonthlyRecord[];
  spendingByCategoryLastMonth: SpendingByCategory;
  metrics: Metric[];
  alerts: Alert[];
}
