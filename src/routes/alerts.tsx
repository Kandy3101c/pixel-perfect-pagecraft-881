import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppShell";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Steady" },
      { name: "description", content: "Alerts in Steady, your personal financial health app." },
      { property: "og:title", content: "Alerts — Steady" },
      { property: "og:description", content: "Alerts in Steady, your personal financial health app." },
    ],
  }),
  component: () => <ComingSoon title="Alerts" />,
});
