import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Steady" },
      { name: "description", content: "Settings in Steady, your personal financial health app." },
      { property: "og:title", content: "Settings — Steady" },
      { property: "og:description", content: "Settings in Steady, your personal financial health app." },
    ],
  }),
  component: () => <ComingSoon title="Settings" />,
});
