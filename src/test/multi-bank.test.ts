import { afterEach, expect, it, vi } from "vitest";
import { createAccountsStore } from "@/data/accountsStore";
import { getAccountDetails } from "@/data/api";
import { mockData } from "@/data/mock";
import { accountSummary } from "@/lib/accounts";

afterEach(() => vi.useRealTimers());
it("starts with only PNC and seven unique supplied account IDs", () => {
  const state = createAccountsStore().getSnapshot();
  expect(state.institutions).toEqual([{ id: "inst_pnc", name: "PNC Bank", source: "pnc", status: "synced", lastSynced: "2026-10-31T09:00:00" }]);
  expect(state.accounts.map((item) => item.id)).toEqual(["acct_pnc_checking", "acct_pnc_savings", "acct_pnc_ira", "acct_pnc_card", "acct_pnc_auto", "acct_pnc_personal", "acct_pnc_mortgage"]);
});
it("syncs for exactly two seconds, adds two accounts once, and notifies subscribers only upon completion", async () => {
  vi.useFakeTimers();
  const store = createAccountsStore();
  const callback = vi.fn();
  const unsubscribe = store.subscribeToAccountChanges(callback);
  const promise = store.connectBank();
  expect(store.getSnapshot().institutions[1]?.status).toBe("syncing");
  expect(callback).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1999);
  expect(store.getSnapshot().accounts).toHaveLength(7);
  await vi.advanceTimersByTimeAsync(1);
  await promise;
  expect(store.getSnapshot().accounts).toHaveLength(9);
  expect(store.getSnapshot().institutions[1]).toMatchObject({ status: "synced", lastSynced: new Date().toISOString() });
  expect(callback).toHaveBeenCalledWith(expect.objectContaining({ addedAccountIds: ["acct_plat_savings", "acct_plat_card"] }));
  await store.connectBank();
  expect(callback).toHaveBeenCalledTimes(1);
  unsubscribe();
  store.disconnectBank("inst_platypus");
  const again = store.connectBank();
  await vi.advanceTimersByTimeAsync(2000); await again;
  expect(callback).toHaveBeenCalledTimes(1);
});
it("matches duplicate savings and card types by ID with distinct histories and credit limits", async () => {
  vi.useFakeTimers(); const store = createAccountsStore(); const promise = store.connectBank();
  await vi.advanceTimersByTimeAsync(2000); await promise;
  const state = store.getSnapshot(); const views = getAccountDetails(state.accounts, state.details);
  expect(views.find((item) => item.id === "acct_plat_savings")).toMatchObject({ balance: 21131.81, yield: 2.5, history: [20046,20145,20244,20344,20444,20535,20619,20712,20832,20924,21051,21132] });
  expect(views.find((item) => item.id === "acct_plat_card")).toMatchObject({ balance: 6667.18, limit: 10095.97, usage: 66, payoff: { months: 53, totalInterest: 3893 }, history: [6606,6612,6617,6623,6628,6634,6639,6645,6651,6656,6662,6667] });
  expect(views.find((item) => item.id === "acct_pnc_card")).toMatchObject({ limit: 5332.24, usage: 187 });
  expect(views.find((item) => item.id === "acct_plat_card")?.activity[3]).toMatchObject({ incoming: true, displayAmount: "+$725.59" });
});
it("updates bank-filtered totals immediately and removes only the disconnected bank", async () => {
  vi.useFakeTimers(); const store = createAccountsStore(); const promise = store.connectBank();
  await vi.advanceTimersByTimeAsync(2000); await promise;
  expect(accountSummary(store.getSnapshot().accounts.filter((item) => item.institutionId === "inst_platypus"))).toEqual({ assets: 21131.81, debts: 6667.18, monthlyPayments: 200.02 });
  expect(accountSummary(store.getSnapshot().accounts).assets).toBeCloseTo(89857.68);
  expect(accountSummary(store.getSnapshot().accounts).debts).toBeCloseTo(341218.59);
  expect(accountSummary(store.getSnapshot().accounts).monthlyPayments).toBeCloseTo(3319.06);
  store.disconnectBank("inst_platypus");
  expect(store.getSnapshot().accounts).toEqual(mockData.accounts);
  expect(store.getSnapshot().details).toHaveLength(7);
});
it("leaves dashboard health indicators and alerts unchanged after linking", async () => {
  vi.useFakeTimers(); const before = JSON.stringify({ metrics: mockData.metrics, alerts: mockData.alerts });
  const store = createAccountsStore(); const promise = store.connectBank(); await vi.advanceTimersByTimeAsync(2000); await promise;
  expect(mockData.metrics.map((item) => item.value)).toEqual([1.9, 0.47, 1.87, -1153]);
  expect(JSON.stringify({ metrics: mockData.metrics, alerts: mockData.alerts })).toBe(before);
});