import { describe, expect, it, vi } from "vitest";
import { alertsReducer } from "@/data/alertsStore";
import { createDemoAlert } from "@/data/demoAlerts";
import { injectDemoEvent, sendCoachMessage } from "@/data/api";
import { mockData } from "@/data/mock";
import { filterAlerts, groupAlerts } from "@/lib/alerts";

const initial = () => ({ alerts: mockData.alerts, usedDemoIds: [] as string[] });
describe("Shared alerts", () => {
  it("mark read decreases unread from four to three", () => {
    const state = alertsReducer(initial(), { type: "read", id: "a1" });
    expect(filterAlerts(state.alerts, "Unread")).toHaveLength(3);
    expect(state.alerts.find((alert) => alert.id === "a1")?.read).toBe(true);
  });
  it("mark all read leaves no unread alerts without removing alerts", () => {
    const state = alertsReducer(initial(), { type: "readAll" });
    expect(filterAlerts(state.alerts, "Unread")).toHaveLength(0);
    expect(state.alerts).toHaveLength(5);
  });
  it("dismiss removes only the selected alert", () => {
    expect(alertsReducer(initial(), { type: "dismiss", id: "a1" }).alerts.map((alert) => alert.id)).toEqual(["a2", "a3", "a4", "a5"]);
  });
  it("adds each demo type once despite unique alert IDs and dismissal, until reset", () => {
    const alert = { ...createDemoAlert("medical_bill", "2026-11-08"), id: "demo-medical_bill-1000" };
    const second = { ...alert, id: "demo-medical_bill-2000" };
    const added = alertsReducer(initial(), { type: "add", alert });
    expect(added.alerts[0]).toEqual(alert);
    expect(added.usedDemoIds).toEqual(["demo-medical_bill"]);
    expect(filterAlerts(added.alerts, "Unread")).toHaveLength(5);
    const dismissed = alertsReducer(added, { type: "dismiss", id: alert.id });
    expect(alertsReducer(dismissed, { type: "add", alert: second }).alerts).toHaveLength(5);
    const reset = alertsReducer(added, { type: "resetDemo" });
    expect(reset.alerts).toEqual(mockData.alerts);
    expect(reset.usedDemoIds).toEqual([]);
    expect(alertsReducer(reset, { type: "add", alert: second }).alerts).toHaveLength(6);
  });
  it("adds the iMessage channel only after confirmed phone delivery", () => {
    const alert = { ...createDemoAlert("medical_bill", "2026-11-08"), id: "demo-medical_bill-1000" };
    const added = alertsReducer(initial(), { type: "add", alert });
    expect(added.alerts[0]?.channels).toEqual(["app"]);
    const delivered = alertsReducer(added, { type: "phoneSent", id: alert.id });
    expect(delivered.alerts[0]?.channels).toEqual(["app", "imessage"]);
    expect(alertsReducer(delivered, { type: "phoneSent", id: alert.id }).alerts[0]?.channels).toEqual(["app", "imessage"]);
  });
  it("groups by actual date and sorts newest first", () => {
    const today = createDemoAlert("job_loss", "2026-11-08");
    const month = { ...today, id: "month", date: "2026-11-02" };
    expect(groupAlerts([...mockData.alerts, month, today], "2026-11-08").map((group) => [group.label, group.alerts.map((alert) => alert.id)])).toEqual([["Today", ["demo-job_loss"]], ["This month", ["month"]], ["Earlier", ["a1", "a2", "a3", "a4", "a5"]]]);
  });
  it("keeps existing alert metric and delivery assignments", () => {
    expect(mockData.alerts.slice(0, 2).map((alert) => [alert.metricId, alert.channels])).toEqual([["credit_utilization", ["app", "imessage"]], ["credit_utilization", ["app", "imessage"]]]);
    expect(mockData.alerts[2]?.metricId).toBe("emergency_fund");
    expect(mockData.alerts[2]?.channels).toEqual(["app"]);
  });
});
describe("Demo events", () => {
  it.each([
    ["medical_bill", "critical", "$3,000", "$15,700", "1.9 months", "emergency_fund"],
    ["job_loss", "critical", "$8,440", "No payroll", "2.2 months", "emergency_fund"],
    ["rate_increase", "warning", "22.5%", "27.5%", "$42", "credit_utilization"],
  ])("returns %s with the specified financial amounts", (type, severity, amount, other, action, metricId) => {
    const alert = createDemoAlert(type, "2026-11-08");
    expect(alert.reason).toContain(amount);
    expect(alert.reason).toContain(other);
    expect(alert.suggestedAction).toContain(action);
    expect(alert).toMatchObject({ severity, metricId, date: "2026-11-08", channels: ["app"], read: false, isDemo: true });
  });
  it("waits 800ms, gives the injected alert a unique ID, and supports Coach explanation", async () => {
    vi.useFakeTimers();
    try {
      let settled = false;
      const promise = injectDemoEvent("rate_increase").then((alert) => { settled = true; return alert; });
      await vi.advanceTimersByTimeAsync(799); expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1); const alert = await promise; expect(settled).toBe(true);
      expect(alert.id).toMatch(/^demo-rate_increase-\d+$/);
      const reply = sendCoachMessage(`Explain this alert: ${alert.title}`, [], { alertId: alert.id });
      await vi.advanceTimersByTimeAsync(1200);
      expect((await reply).reply).toBe(`${alert.reason} ${alert.suggestedAction}`);
    } finally { vi.useRealTimers(); }
  });
});