import { afterEach, describe, expect, it, vi } from "vitest";
import { accountDetails, mockData } from "@/data/mock";
import { sendCoachMessage, startBankConnection, useAccountDetails } from "@/data/api";
import { accountSummary } from "@/lib/accounts";

afterEach(() => vi.useRealTimers());

describe("Accounts demo", () => {
  it("sums only financial assets and debt payments from the existing accounts", () => {
    expect(accountSummary(mockData.accounts)).toEqual({ assets: 68725.87, debts: 334551.41000000003, monthlyPayments: 3119.04 });
  });
  it("matches all seven accounts by type with 12 supplied monthly balances", () => {
    const accounts = useAccountDetails();
    expect(accounts).toHaveLength(7);
    for (const account of accounts) {
      expect(account.history).toEqual(accountDetails.find((item) => item.type === account.type)?.history);
      expect(account.chart).toHaveLength(12);
      expect(account.chart[0].month).toBe("Nov 25");
      expect(account.chart[11].month).toBe("Oct 26");
    }
    expect(accounts[0].history).toEqual([7274,6600,6056,5004,6164,7028,6270,6113,6380,6560,5512,6123]);
  });
  it("shows credit purchases and interest as money out and payments as money in", () => {
    const credit = useAccountDetails().find((account) => account.type === "credit_card");
    expect(credit?.activity[0]).toMatchObject({ incoming: false, displayAmount: "−$311.78", displayLabel: "Dining" });
    expect(credit?.activity[2]).toMatchObject({ incoming: false, displayAmount: "−$186.81" });
    expect(credit?.activity[3]).toMatchObject({ incoming: true, displayAmount: "+$1,425.62", displayLabel: "Payment received" });
  });
  it("shows asset withdrawals as money out and deposits as money in", () => {
    const accounts = useAccountDetails();
    expect(accounts.find((a) => a.type === "checking")?.activity[0]).toMatchObject({ incoming: false, displayAmount: "−$2,062.96" });
    expect(accounts.find((a) => a.type === "savings")?.activity[0]).toMatchObject({ incoming: true, displayAmount: "+$25.05" });
  });
  it("treats falling debts as good and the rising 187% credit balance as risk", () => {
    const accounts = useAccountDetails();
    expect(accounts.find((a) => a.type === "auto_loan")).toMatchObject({ good: true, change: -1657 });
    expect(accounts.find((a) => a.type === "credit_card")).toMatchObject({ good: false, change: 91, usage: 187, usageWidth: "93.5%", limitWidth: "50%" });
  });
  it.each([
    ["credit_card", 53, 5823], ["auto_loan", 57, 5569], ["personal_loan", 44, 3046], ["mortgage", 332, 325707],
  ])("retains the exact supplied %s payoff estimate", (type, months, interest) => {
    expect(useAccountDetails().find((a) => a.type === type)?.payoff).toMatchObject({ months, totalInterest: interest });
  });
  it("simulates bank connection for exactly one second without changing accounts", async () => {
    vi.useFakeTimers();
    const before = JSON.stringify(mockData.accounts);
    let connected = false;
    const promise = startBankConnection().then(() => { connected = true; });
    await vi.advanceTimersByTimeAsync(999);
    expect(connected).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(connected).toBe(true);
    expect(JSON.stringify(mockData.accounts)).toBe(before);
  });
  it("answers the account handoff with the corresponding supplied financial data", async () => {
    vi.useFakeTimers();
    const promise = sendCoachMessage("Tell me about my Auto loan", []);
    await vi.advanceTimersByTimeAsync(1200);
    const reply = await promise;
    expect(reply.verified).toBe(true);
    expect(reply.reply).toContain("$28,908");
    expect(reply.reply).toContain("7.5% APR");
    expect(reply.reply).toContain("57 months");
    expect(reply.sources).toEqual(["Auto loan account", "12-month account history"]);
  });
});