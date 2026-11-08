import { createContext, useContext, useReducer, type ReactNode } from "react";
import { useAlerts } from "./api";
import type { Alert } from "./types";

type AlertsState = { alerts: Alert[]; usedDemoIds: string[] };
type AlertsAction = { type: "read" | "dismiss"; id: string } | { type: "readAll" | "resetDemo" } | { type: "add"; alert: Alert };

export function alertsReducer(state: AlertsState, action: AlertsAction): AlertsState {
  switch (action.type) {
    case "read": return { ...state, alerts: state.alerts.map((alert) => alert.id === action.id ? { ...alert, read: true } : alert) };
    case "readAll": return { ...state, alerts: state.alerts.map((alert) => ({ ...alert, read: true })) };
    case "dismiss": return { ...state, alerts: state.alerts.filter((alert) => alert.id !== action.id) };
    case "resetDemo": return { alerts: state.alerts.filter((alert) => !alert.isDemo), usedDemoIds: [] };
    case "add":
      if (state.alerts.some((alert) => alert.id === action.alert.id) || (action.alert.isDemo && state.usedDemoIds.includes(action.alert.id))) return state;
      return { alerts: [action.alert, ...state.alerts], usedDemoIds: action.alert.isDemo ? [...state.usedDemoIds, action.alert.id] : state.usedDemoIds };
  }
}

type AlertsStore = AlertsState & {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  addAlert: (alert: Alert) => void;
  resetDemo: () => void;
};
const AlertsContext = createContext<AlertsStore | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const initialAlerts = useAlerts();
  const [state, dispatch] = useReducer(alertsReducer, { alerts: initialAlerts, usedDemoIds: [] });
  return <AlertsContext.Provider value={{ ...state, markAsRead: (id) => dispatch({ type: "read", id }), markAllAsRead: () => dispatch({ type: "readAll" }), dismiss: (id) => dispatch({ type: "dismiss", id }), addAlert: (alert) => dispatch({ type: "add", alert }), resetDemo: () => dispatch({ type: "resetDemo" }) }}>{children}</AlertsContext.Provider>;
}

export function useAlertsStore() {
  const store = useContext(AlertsContext);
  if (!store) throw new Error("AlertsProvider is required");
  return store;
}