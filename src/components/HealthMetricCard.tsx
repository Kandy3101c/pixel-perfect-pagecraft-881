import { Info } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Metric } from "@/data/types";
import { formatPct, formatUSD } from "@/lib/format";
import { goalProgress } from "@/lib/goals";
import { ProgressRing } from "@/components/ProgressRing";
import { STATUS, StatusPill } from "@/components/Status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const axisTick = { fontSize: 11, fill: "var(--muted-foreground)" };

function metricValue(metric: Metric) {
  if (metric.unit === "percent") return formatPct(metric.value);
  if (metric.unit === "dollars") return formatUSD(metric.value);
  return `${metric.value} months`;
}

function EmergencyFundVisual({ metric }: { metric: Metric }) {
  const progress = goalProgress(metric.value, metric.unit, metric.target) ?? 0;

  return (
    <>
      <ProgressRing progress={progress} color={STATUS[metric.status].stroke}>
        <span className="text-2xl font-bold tabular-nums">{metric.value}</span>
        <span className="text-xs text-muted-foreground">{metric.unit}</span>
      </ProgressRing>
      <p className="text-sm font-semibold">{formatPct(progress)} of your goal</p>
      <StatusPill status={metric.status} />
      <p className="text-xs font-medium text-muted-foreground">Target: {metric.target}</p>
    </>
  );
}

function DebtToIncomeVisual({ metric }: { metric: Metric }) {
  const debtShare = Math.min(100, Math.max(0, metric.value * 100));
  const data = [
    { name: "Debt payments", value: debtShare },
    { name: "Remaining income", value: 100 - debtShare },
  ];

  return (
    <>
      <div
        className="relative mx-auto h-32 w-full max-w-40"
        role="img"
        aria-label={`${formatPct(metric.value)} of monthly income goes to debt payments`}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius={42}
              outerRadius={58}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={STATUS[metric.status].stroke} />
              <Cell fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center leading-tight">
          <div>
            <p className="text-2xl font-bold tabular-nums">{formatPct(metric.value)}</p>
            <p className="text-[11px] text-muted-foreground">of income</p>
          </div>
        </div>
      </div>
      <StatusPill status={metric.status} />
      <p className="text-xs font-medium text-muted-foreground">Target: {metric.target}</p>
    </>
  );
}

function CreditUseVisual({ metric }: { metric: Metric }) {
  return (
    <div className="flex w-full flex-1 items-center justify-center gap-3 whitespace-nowrap">
      <p className="text-3xl font-bold tracking-tight tabular-nums">{formatPct(metric.value)}</p>
      <StatusPill status={metric.status} />
    </div>
  );
}

function cashFlowAxisLabel(value: number) {
  if (value === 0) return "$0";
  const sign = value > 0 ? "+" : "−";
  return `${sign}$${+(Math.abs(value) / 1000).toFixed(1)}k`;
}

function CashFlowVisual({ metric }: { metric: Metric }) {
  const bound = Math.max(1000, Math.ceil(Math.abs(metric.value) / 1000) * 1000);
  const data = [{ name: "Cash flow", value: metric.value, valueLabel: formatUSD(metric.value) }];

  return (
    <>
      <div
        className="h-32 w-full"
        role="img"
        aria-label={`Monthly cash flow is ${formatUSD(metric.value)} on an axis from negative ${formatUSD(bound)} to positive ${formatUSD(bound)}`}
      >
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 26, right: 58, bottom: 0, left: 58 }}>
            <XAxis
              type="number"
              domain={[-bound, bound]}
              ticks={[-bound, 0, bound]}
              tickFormatter={cashFlowAxisLabel}
              tick={axisTick}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis type="category" dataKey="name" hide />
            <ReferenceLine x={0} stroke="var(--muted-foreground)" />
            <Bar
              dataKey="value"
              fill={STATUS[metric.status].stroke}
              radius={4}
              maxBarSize={22}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="valueLabel"
                position={metric.value < 0 ? "left" : "right"}
                fill="var(--foreground)"
                fontSize={13}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <StatusPill status={metric.status} />
      <p className="text-xs font-medium text-muted-foreground">Target: {metric.target}</p>
    </>
  );
}

function MetricVisual({ metric }: { metric: Metric }) {
  switch (metric.id) {
    case "emergency_fund":
      return <EmergencyFundVisual metric={metric} />;
    case "debt_to_income":
      return <DebtToIncomeVisual metric={metric} />;
    case "credit_utilization":
      return <CreditUseVisual metric={metric} />;
    case "monthly_cash_flow":
      return <CashFlowVisual metric={metric} />;
    default:
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-3xl font-bold tracking-tight">{metricValue(metric)}</p>
          <StatusPill status={metric.status} />
          <p className="text-xs font-medium text-muted-foreground">Target: {metric.target}</p>
        </div>
      );
  }
}

export function HealthMetricCard({ metric }: { metric: Metric }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`${metric.label}: ${metricValue(metric)}. View details`}
          className="flex min-h-64 w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-soft transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-6"
        >
          <span className="flex w-full items-center justify-between gap-2 text-sm font-medium text-muted-foreground">
            <span>{metric.label}</span>
            <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          </span>
          <MetricVisual metric={metric} />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <div className="mb-1 flex justify-center sm:justify-start">
            <StatusPill status={metric.status} />
          </div>
          <DialogTitle>{metric.label}</DialogTitle>
          <DialogDescription className="pt-2 text-base leading-relaxed text-foreground">
            {metric.explanation}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Current</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{metricValue(metric)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Target</p>
            <p className="mt-1 font-semibold">{metric.target}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
