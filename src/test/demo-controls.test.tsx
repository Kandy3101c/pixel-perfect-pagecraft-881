import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlertDemoControls } from "@/components/AlertDemoControls";
import { AlertsProvider, useAlertsStore } from "@/data/alertsStore";
import { SessionProvider, sessionStore } from "@/data/session";
import { NOTIFIER_URL } from "@/data/config";

const fetchMock = vi.fn();
function StateProbe() {
  const { alerts } = useAlertsStore();
  return <output data-testid="alerts">{JSON.stringify(alerts.filter((alert) => alert.isDemo))}</output>;
}
function currentAlerts(): { id: string; channels: string[] }[] {
  return JSON.parse(screen.getByTestId("alerts").textContent ?? "[]");
}
async function inject(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label, exact: true }));
  await act(async () => { await vi.advanceTimersByTimeAsync(800); });
}

beforeEach(() => {
  vi.useFakeTimers();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  sessionStore.signOut();
  render(<SessionProvider><AlertsProvider><AlertDemoControls onAdded={() => {}} /><StateProbe /></AlertsProvider></SessionProvider>);
  act(() => sessionStore.selectCustomer("C007"));
  fireEvent.click(screen.getByRole("button", { name: "Demo controls" }));
});
afterEach(() => {
  cleanup();
  sessionStore.signOut();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Demo controls phone delivery", () => {
  it.each([
    ["Medical bill", "medical_bill"],
    ["Job loss", "job_loss"],
    ["Card rate increase", "rate_increase"],
  ])("sends %s for the selected customer and allows a new event after reset", async (label, type) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ sent: true }) });
    await inject(label);
    const first = currentAlerts()[0];
    expect(first?.id).toMatch(new RegExp(`^demo-${type}-\\d+$`));
    expect(first?.channels).toEqual(["app", "imessage"]);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${NOTIFIER_URL}/api/alerts/notify`);
    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body);
    expect(body.customerId).toBe("C007");
    expect(body.alert.id).toBe(first?.id);
    expect(Object.keys(body.alert).sort()).toEqual(["id", "reason", "severity", "suggestedAction", "title"]);
    expect(screen.getByRole("button", { name: `${label} · Added` })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reset demo" }));
    expect(currentAlerts()).toEqual([]);
    expect(screen.getByRole("button", { name: label, exact: true })).toBeEnabled();
    await inject(label);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(currentAlerts()[0]?.id).not.toBe(first?.id);
  });

  it("adds the app alert before waiting for the phone response", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    await inject("Medical bill");
    expect(currentAlerts()).toHaveLength(1);
    expect(currentAlerts()[0]?.channels).toEqual(["app"]);
  });

  it.each(["not sent", "offline"])("keeps the app alert without an iMessage channel when %s", async (outcome) => {
    if (outcome === "offline") fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    else fetchMock.mockResolvedValue({ ok: true, json: async () => ({ sent: false, why: "Quiet hours" }) });
    await inject("Job loss");
    expect(currentAlerts()).toHaveLength(1);
    expect(currentAlerts()[0]?.channels).toEqual(["app"]);
  });
});