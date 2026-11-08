import { Info } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { Metric, MonthlyRecord } from "@/data/types";
import { DebtToIncomeTrend } from "@/components/DebtToIncomeTrend";
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
        <span className="font-serif text-3xl font-semibold tabular-nums">{metric.value}</span>
        <span className="font-serif text-sm text-muted-foreground">{metric.unit}</span>
      </ProgressRing>
      <p className="font-serif text-base font-semibold">{formatPct(progress)} of your goal</p>
      <StatusPill status={metric.status} />
      <p className="font-serif text-sm font-medium text-muted-foreground">Target: {metric.target}</p>
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
            <p className="font-serif text-3xl font-semibold tabular-nums">{formatPct(metric.value)}</p>
            <p className="font-serif text-xs text-muted-foreground">of income</p>
          </div>
        </div>
      </div>
      <StatusPill status={metric.status} />
      <p className="font-serif text-sm font-medium text-muted-foreground">Target: {metric.target}</p>
    </>
  );
}

function CreditUseVisual({ metric }: { metric: Metric }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 whitespace-nowrap">
      <p className="font-serif text-4xl font-semibold tracking-tight tabular-nums">{formatPct(metric.value)}</p>
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
  const zeroX = 160;
  const valueX = zeroX + (metric.value / bound) * 100;
  const isNegative = metric.value < 0;

  return (
    <>
      <svg
        viewBox="0 0 320 120"
        className="h-32 w-full"
        role="img"
        aria-label={`Monthly cash flow is ${formatUSD(metric.value)} on an axis from negative ${formatUSD(bound)} to positive ${formatUSD(bound)}`}
      >
        <line x1={zeroX} y1={20} x2={zeroX} y2={84} stroke="var(--muted-foreground)" strokeWidth={1.5} />
        <rect
          x={Math.min(zeroX, valueX)}
          y={32}
          width={Math.abs(valueX - zeroX)}
          height={22}
          rx={4}
          fill={isNegative ? "var(--risk)" : "var(--good)"}
        />
        <text
          x={isNegative ? valueX - 8 : valueX + 8}
          y={43}
          dominantBaseline="middle"
          textAnchor={isNegative ? "end" : "start"}
          fill="var(--foreground)"
          fontFamily="var(--font-serif)"
          fontSize={16}
          fontWeight={600}
        >
          {formatUSD(metric.value)}
        </text>
        <line x1={30} y1={84} x2={290} y2={84} stroke="var(--subtle-foreground)" strokeOpacity={0.5} />
        {[-bound, 0, bound].map((tick, index) => (
          <g key={tick}>
            <line x1={60 + index * 100} y1={80} x2={60 + index * 100} y2={88} stroke="var(--border)" />
            <text
              x={60 + index * 100}
              y={105}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-serif)"
              fontSize={13}
            >
              {cashFlowAxisLabel(tick)}
            </text>
          </g>
        ))}
      </svg>
      <StatusPill status={metric.status} />
      <p className="font-serif text-sm font-medium text-muted-foreground">Target: {metric.target}</p>
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
          <p className="font-serif text-4xl font-semibold tracking-tight tabular-nums">{metricValue(metric)}</p>
          <StatusPill status={metric.status} />
          <p className="font-serif text-sm font-medium text-muted-foreground">Target: {metric.target}</p>
        </div>
      );
  }
}

export function HealthMetricCard({ metric, months }: { metric: Metric; months: MonthlyRecord[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`${metric.label}: ${metricValue(metric)}. View details`}
          className="flex min-h-64 w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-soft transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-6"
        >
          <span className="flex w-full items-center justify-center gap-2 text-center font-serif text-base font-medium text-muted-foreground">
            <span>{metric.label}</span>
            <Info className="h-4 w-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
          </span>
          <MetricVisual metric={metric} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="mb-1 flex justify-center">
            <StatusPill status={metric.status} />
          </div>
          <DialogTitle className="font-serif text-xl">{metric.label}</DialogTitle>
          <DialogDescription className="pt-2 text-base leading-relaxed text-foreground">
            {metric.explanation}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 text-center">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Current</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{metricValue(metric)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Target</p>
            <p className="mt-1 font-serif text-lg font-semibold">{metric.target}</p>
          </div>
        </div>
        {metric.id === "debt_to_income" && <DebtToIncomeTrend months={months} />}
      </DialogContent>
    </Dialog>
  );
}
