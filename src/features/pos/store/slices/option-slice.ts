import type { Store } from "@/features/pos/store/store";
import type { StateCreator } from "zustand";

export type OptionState = {
  allowDebt: boolean;
  storeChangeAsCredit: boolean;
};

export type OptionActions = {
  toggleAllowDebt: () => void;
  toggleStoreCredit: () => void;
  syncOptions: () => void;
  clearOptions: () => void;
};

export type OptionSlice = OptionState & OptionActions;

const initialState: OptionState = {
  allowDebt: false,
  storeChangeAsCredit: false,
};

export const createOptionSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  OptionSlice
> = (set) => ({
  ...initialState,
  toggleAllowDebt: () =>
    set((s) => {
      s.allowDebt = !s.allowDebt;
    }),
  toggleStoreCredit: () =>
    set((s) => {
      s.storeChangeAsCredit = !s.storeChangeAsCredit;
    }),
  syncOptions: () =>
    set((s) => {
      const totalAmount = s.items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const difference = totalAmount - totalPaid;

      if (difference <= 0) s.allowDebt = false;
      if (difference >= 0) s.storeChangeAsCredit = false;
    }),
  clearOptions: () => set(() => initialState),
});
