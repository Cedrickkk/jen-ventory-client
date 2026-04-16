import type { StateCreator } from "zustand";
import type { Store } from "../store";

export type CustomerSummary = {
  id: number;
  name: string;
  phone: string;
  image: string;
};

export type CustomerState = {
  selectedCustomer: CustomerSummary | null;
  representativeName: string;
};

export type CustomerActions = {
  setCustomer: (customer: CustomerSummary) => void;
  setRepresentativeName: (name: string) => void;
  clearCustomer: () => void;
};

export type CustomerSlice = CustomerState & CustomerActions;

const initialState: CustomerState = {
  selectedCustomer: null,
  representativeName: "Walk-in",
};

export const createCustomerSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  CustomerSlice
> = (set) => ({
  ...initialState,
  setCustomer: (customer) =>
    set((s) => {
      s.selectedCustomer = customer;
      s.representativeName = "";
    }),
  setRepresentativeName: (name) =>
    set((s) => {
      s.representativeName = name;
    }),
  clearCustomer: () => set(() => initialState),
});
