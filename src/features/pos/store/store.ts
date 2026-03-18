import {
  type CartSlice,
  createCartSlice,
} from "@/features/pos/store/slices/cart-slice";
import {
  createCustomerSlice,
  type CustomerSlice,
} from "@/features/pos/store/slices/customer-slice";
import {
  createOptionSlice,
  type OptionSlice,
} from "@/features/pos/store/slices/option-slice";
import {
  createPaymentSlice,
  type PaymentSlice,
} from "@/features/pos/store/slices/payment-slice";
import {
  createUISlice,
  type UISlice,
} from "@/features/pos/store/slices/ui-slice";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Store = CartSlice &
  CustomerSlice &
  PaymentSlice &
  UISlice &
  OptionSlice & { resetPOS: () => void };

export const useAppStore = create<Store>()(
  immer((...a) => ({
    ...createCartSlice(...a),
    ...createCustomerSlice(...a),
    ...createPaymentSlice(...a),
    ...createUISlice(...a),
    ...createOptionSlice(...a),

    resetPOS: () => {
      const [set] = a;

      set((s) => {
        s.items = [];
        s.selectedCustomer = null;
        s.representativeName = "Walk-in";
        s.payments = [];
        s.allowDebt = false;
        s.storeChangeAsCredit = false;
      });
    },
  })),
);
