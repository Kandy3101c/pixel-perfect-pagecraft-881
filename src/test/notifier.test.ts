import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { notifyPhone, saveAlertSettings, sendTestAlert } from "@/data/api";
import { NOTIFIER_URL } from "@/data/config";
import { createDemoAlert } from "@/data/demoAlerts";
import { sessionStore } from "@/data/session";
import { defaultAlertSettings } from "@/lib/settings";

const fetchMock = vi.fn();
function response(body: unknown, ok = true) {
  return { ok, json: vi.fn().mockResolvedValue(body) } as unknown as Response;
}
function sentBody(call = 0) {
  return JSON.parse(String(fetchMock.mock.calls[call]?.[1]?.body));
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  sessionStore.selectCustomer("C024");
});
afterEach(() => {
  vi.unstubAllGlobals();
  sessionStore.signOut();
});

describe("Notifier alert settings", () => {
  it("posts the selected customer and exact server settings shape, then saves locally", async () => {
    fetchMock.mockResolvedValue(response({ saved: true }));
    const settings = {
      ...defaultAlertSettings,
      phoneE164: "+15551234567",
      consent: true,
      channels: { app: true as const, imessage: true },
      phoneSeverity: "critical_warning" as const,
      hideAmounts: false,
      quietHours: { enabled: true, start: "22:00", end: "08:00" },
      alertTypes: { ...defaultAlertSettings.alertTypes, feesCharged: false },
    };
    await saveAlertSettings("C007", settings);
    expect(fetchMock).toHaveBeenCalledWith(`${NOTIFIER_URL}/api/alerts/settings`, expect.objectContaining({ method: "POST", headers: { "Content-Type": "application/json" } }));
    expect(sentBody()).toEqual({
      customerId: "C007",
      settings: {
        phoneE164: "+15551234567",
        consent: true,
        imessageEnabled: true,
        sendToPhone: "critical_and_warnings",
        hideAmounts: false,
        quietHours: { enabled: true, start: "22:00", end: "08:00" },
        enabledTypes: ["overCreditLimit", "highCardUse", "cardBalanceRising", "lowEmergencyFund", "highDebtPayments", "spendingOverIncome", "missingPaycheck", "largeUnusualPayment"],
      },
    });
    expect(sessionStore.getSnapshot().alertSettings).toEqual(settings);
  });
  it("shows the service error and does not save settings locally", async () => {
    fetchMock.mockResolvedValue(response({ error: "Phone consent is required" }, false));
    await expect(saveAlertSettings("C024", { ...defaultAlertSettings, consent: true })).rejects.toThrow("Phone consent is required");
    expect(sessionStore.getSnapshot().alertSettings.consent).toBe(false);
  });
  it("turns a network failure into a clear settings error", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(saveAlertSettings("C024", defaultAlertSettings)).rejects.toThrow("Couldn't save alert settings. Is the alert service running?");
  });
});

describe("Notifier test alerts", () => {
  it("posts only the E.164 phone number", async () => {
    fetchMock.mockResolvedValue(response({ sent: true }));
    await sendTestAlert("+15551234567");
    expect(fetchMock).toHaveBeenCalledWith(`${NOTIFIER_URL}/api/alerts/test`, expect.objectContaining({ method: "POST" }));
    expect(sentBody()).toEqual({ phoneE164: "+15551234567" });
  });
  it("uses the supplied fallback when a failed response has no error", async () => {
    fetchMock.mockResolvedValue(response({}, false));
    await expect(sendTestAlert("+15551234567")).rejects.toThrow("Couldn't send the test alert. Is the alert service running?");
  });
  it("uses the same clear fallback when the service cannot be reached", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(sendTestAlert("+15551234567")).rejects.toThrow("Couldn't send the test alert. Is the alert service running?");
  });
});

describe("Notifier demo delivery", () => {
  it("posts only the required alert fields and returns the service delivery result", async () => {
    fetchMock.mockResolvedValue(response({ sent: false, why: "Quiet hours" }));
    const alert = { ...createDemoAlert("medical_bill", "2026-11-08"), id: "demo-medical_bill-1794121200000" };
    await expect(notifyPhone("C024", alert)).resolves.toEqual({ sent: false, why: "Quiet hours" });
    expect(fetchMock).toHaveBeenCalledWith(`${NOTIFIER_URL}/api/alerts/notify`, expect.objectContaining({ method: "POST" }));
    expect(sentBody()).toEqual({
      customerId: "C024",
      alert: {
        id: "demo-medical_bill-1794121200000",
        severity: "critical",
        title: "Large medical bill paid",
        reason: "A $3,000 payment left checking and savings at $15,700.",
        suggestedAction: "Your emergency fund now covers about 1.9 months. Pause extra spending until it is rebuilt.",
      },
    });
  });
  it("raises an offline error without hiding the already-added app alert", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const alert = createDemoAlert("job_loss", "2026-11-08");
    await expect(notifyPhone("C024", alert)).rejects.toThrow("Alert service is offline. Alert shown in the app only.");
  });
});
