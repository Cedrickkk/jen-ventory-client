import {
  type CartSlice,
  createCartSlice,
} from "@/features/pos/store/slices/cart-slice";
import {
  createCustomerSlice,
  type CustomerSlice,
} from "@/features/pos/store/slices/customer-slice";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Store = CartSlice & CustomerSlice;

export const useAppStore = create<Store>()(
  immer((...a) => ({
    ...createCartSlice(...a),
    ...createCustomerSlice(...a),
  })),
);
