import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lightbulb, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useAccounts, useCustomer, useMetrics, useMonthly } from "@/data/api";
import { useAlertsStore } from "@/data/alertsStore";
import { SEVERITY } from "@/components/Status";
import { HealthMetricCard } from "@/components/HealthMetricCard";
import { formatDate, formatMonth, formatUSD, humanize } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Steady financial health" },
      { name: "description", content: "See your whole financial picture, health indicators, and alerts in one calm dashboard." },
      { property: "og:title", content: "Dashboard — Steady financial health" },
      { property: "og:description", content: "See your whole financial picture, health indicators, and alerts in one calm dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const SEV_RANK = { critical: 0, warning: 1, info: 2 } as const;
const tooltipStyle = { borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-soft)" };
const axisTick = { fontSize: 13, fill: "var(--muted-foreground)", fontFamily: "var(--font-serif)" };
const kFmt = (v: number) => `$${+(v / 1000).toFixed(1)}k`;

function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-soft md:p-6", className)}>
      {title && <h2 className="mb-4 text-center text-base font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

function Dashboard() {
  const customer = useCustomer();
  const accounts = useAccounts();
  const { months, spendingByCategoryLastMonth } = useMonthly();
  const metrics = useMetrics();
  const { alerts } = useAlertsStore();

  const topAlert = alerts.filter((a) => !a.read).sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || b.date.localeCompare(a.date))[0];
  const monthData = months.map((m) => ({ ...m, label: formatMonth(m.month) }));
  const categories = Object.entries(spendingByCategoryLastMonth)
    .map(([k, v]) => ({ name: humanize(k), amount: v }))
    .sort((a, b) => b.amount - a.amount);
  const assets = accounts.filter((a) => ["checking", "savings", "ira"].includes(a.type));
  const debts = accounts.filter((a) => !["checking", "savings", "ira"].includes(a.type));
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
      <div className="space-y-6 rounded-3xl bg-background">
      <div>
        <h1 className="text-center text-2xl font-bold tracking-tight md:text-3xl">Your Financial Health</h1>
        <p className="mt-1 text-sm text-muted-foreground">As of {formatDate(customer.asOf)}</p>
      </div>

      {topAlert && (() => {
        const s = SEVERITY[topAlert.severity];
        return (
          <div className={cn("flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start", s.cls)}>
            <s.icon className="h-6 w-6 shrink-0" />
            <div className="flex-1 text-foreground">
              <p className={cn("text-center text-xs font-bold uppercase tracking-wide", s.text)}>{s.label} alert</p>
              <p className="mt-0.5 text-center font-semibold">{topAlert.title}</p>
              <p className="text-sm text-muted-foreground">{topAlert.reason}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm"><Lightbulb className="h-4 w-4" /> {topAlert.suggestedAction}</p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/coach" search={{ alertId: topAlert.id }}><MessageCircle />Ask about this</Link></Button>
            <Link to="/alerts" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
              View all alerts <ArrowRight className="h-4 w-4" />
            </Link>
            </div>
          </div>
        );
      })()}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => <HealthMetricCard key={metric.id} metric={metric} months={months} />)}
      </div>
      </div>

      <Card title="Money in vs. money out">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={monthData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={kFmt} tick={axisTick} axisLine={false} tickLine={false} width={44} />
              <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar isAnimationActive={false} dataKey="income" name="Income" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={false} dataKey="spending" name="Spending" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar isAnimationActive={false} dataKey="debtPayments" name="Debt payments" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Credit card balance trend">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12000]} tickFormatter={kFmt} tick={axisTick} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={tooltipStyle} />
                <ReferenceLine y={customer.creditLimit} stroke="var(--risk)" strokeDasharray="6 4"
                  label={{ value: `Limit ${formatUSD(customer.creditLimit)}`, position: "insideBottomRight", fill: "var(--risk)", fontSize: 12 }} />
                <Line isAnimationActive={false} type="monotone" dataKey="creditCardBalance" name="Card balance" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Where your money went last month">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categories} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" tickFormatter={(v) => formatUSD(v)} tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar isAnimationActive={false} dataKey="amount" name="Spent" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="What you have">
          <ul className="divide-y">
            {assets.map((a) => (
              <li key={a.type} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{humanize(a.type)}</p>
                  <p className="font-serif text-sm text-muted-foreground">{a.yield ? `${a.yield}% yield` : "No yield"}</p>
                </div>
                <p className="font-serif text-lg font-semibold tabular-nums">{formatUSD(a.balance, true)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t pt-3 font-bold">
            <span>Total</span><span className="font-serif text-lg tabular-nums text-good">{formatUSD(sum(assets.map((a) => a.balance)), true)}</span>
          </div>
        </Card>
        <Card title="What you owe">
          <ul className="divide-y">
            {debts.map((a) => (
              <li key={a.type} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{humanize(a.type)}</p>
                  <p className="font-serif text-sm text-muted-foreground">{a.apr}% APR · {formatUSD(a.monthlyPayment ?? 0, true)}/mo</p>
                </div>
                <p className="font-serif text-lg font-semibold tabular-nums">{formatUSD(a.balance, true)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span className="text-right tabular-nums">
              <span className="font-serif text-lg">{formatUSD(sum(debts.map((a) => a.balance)), true)}</span>
              <span className="font-serif block text-sm font-medium text-muted-foreground">{formatUSD(sum(debts.map((a) => a.monthlyPayment ?? 0)), true)}/mo</span>
            </span>
          </div>
        </Card>
      </div>

      <p className="pb-4 text-center text-xs text-muted-foreground">
        Numbers are calculated from your account data. AI explanations are labeled separately.
      </p>
      <Button asChild className="fixed bottom-20 right-4 z-20 shadow-soft md:bottom-6 md:right-6"><Link to="/coach"><MessageCircle />Ask the coach</Link></Button>
    </div>
  );
}
