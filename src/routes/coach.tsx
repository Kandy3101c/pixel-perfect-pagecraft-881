import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppShell";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Coach — Steady" },
      { name: "description", content: "Coach in Steady, your personal financial health app." },
      { property: "og:title", content: "Coach — Steady" },
      { property: "og:description", content: "Coach in Steady, your personal financial health app." },
    ],
  }),
  component: () => <ComingSoon title="Coach" />,
});
