import type { Store } from "@/features/pos/store/store";
import type { Transaction } from "@/features/transactions/schema/transaction";
import type { StateCreator } from "zustand";

export type ActiveTab = "payment" | "cart";

export type UIState = {
  activeTab: ActiveTab;
  isSubmitting: boolean;
  lastTransaction: Transaction | null;
};

export type UIActions = {
  setActiveTab: (tab: ActiveTab) => void;
  setSubmitting: (val: boolean) => void;
  setLastTransaction: (tx: Transaction) => void;
  clearLastTransaction: () => void;
};

export type UISlice = UIState & UIActions;

const initialState: UIState = {
  activeTab: "cart",
  isSubmitting: false,
  lastTransaction: null,
};

export const createUISlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  UISlice
> = (set) => ({
  ...initialState,
  setActiveTab: (tab) =>
    set((s) => {
      s.activeTab = tab;
    }),
  setSubmitting: (val) =>
    set((s) => {
      s.isSubmitting = val;
    }),
  setLastTransaction: (tx) =>
    set((s) => {
      s.lastTransaction = tx;
    }),
  clearLastTransaction: () =>
    set((s) => {
      s.lastTransaction = null;
    }),
});
