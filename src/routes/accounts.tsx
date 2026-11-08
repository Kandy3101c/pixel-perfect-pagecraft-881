import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppShell";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Steady" },
      { name: "description", content: "Accounts in Steady, your personal financial health app." },
      { property: "og:title", content: "Accounts — Steady" },
      { property: "og:description", content: "Accounts in Steady, your personal financial health app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingSoon title="Accounts" />,
});
