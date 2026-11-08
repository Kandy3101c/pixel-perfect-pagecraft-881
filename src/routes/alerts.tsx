import { createFileRoute } from "@tanstack/react-router";
import { useAlerts } from "@/data/api";
import { CoachAlertCard } from "@/components/CoachAlertCard";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Steady" },
      { name: "description", content: "Alerts in Steady, your personal financial health app." },
      { property: "og:title", content: "Alerts — Steady" },
      { property: "og:description", content: "Alerts in Steady, your personal financial health app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const alerts = useAlerts();
  return <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 md:px-8"><h1 className="text-center text-2xl font-bold">Alerts</h1>{alerts.map((alert) => <CoachAlertCard key={alert.id} alert={alert} />)}</div>;
}
