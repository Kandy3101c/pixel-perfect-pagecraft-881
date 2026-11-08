import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccountCard } from "@/components/AccountCard";
import { AccountDetail } from "@/components/AccountDetail";
import { BankConnectionDialog } from "@/components/BankConnectionDialog";
import { useAccountDetails, useAccountSummary } from "@/data/api";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Steady" },
      { name: "description", content: "Explore everything you have and owe, with account histories, recent activity, and demo payoff estimates in Steady." },
      { property: "og:title", content: "Accounts — Steady" },
      { property: "og:description", content: "Your accounts, balance histories, recent activity, and payoff estimates in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Accounts,
});

function Accounts() {
  const accounts = useAccountDetails();
  const summary = useAccountSummary();
  const [selected, setSelected] = useState<string>();
  return <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">Accounts</h1><p className="mt-1 text-sm text-muted-foreground">Everything you have and owe, in one place.</p></div><BankConnectionDialog /></header>
    <section aria-label="Account summary">
      <div className="grid gap-3 sm:grid-cols-3">{[{ label: "What you have", value: summary.assets }, { label: "What you owe", value: summary.debts }, { label: "Monthly debt payments", value: summary.monthlyPayments }].map((stat) => <div key={stat.label} className="rounded-lg border bg-card px-4 py-5 text-center shadow-soft"><h2 className="text-sm font-semibold text-muted-foreground">{stat.label}</h2><p className="mt-2 font-serif text-3xl font-semibold">{formatUSD(stat.value)}</p></div>)}</div>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">Home and car values aren't included in this data, so we don't show net worth.</p>
    </section>
    {[{ label: "What you have", debt: false }, { label: "What you owe", debt: true }].map((section) => <section key={section.label}><h2 className="mb-4 text-center text-lg font-semibold">{section.label}</h2><div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">{accounts.filter((account) => account.debt === section.debt).map((account) => <AccountCard key={account.type} account={account} onOpen={() => setSelected(account.type)} />)}</div></section>)}
    <AccountDetail account={accounts.find((account) => account.type === selected)} onClose={() => setSelected(undefined)} />
  </div>;
}
