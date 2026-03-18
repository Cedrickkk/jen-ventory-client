import type { Store } from "@/features/pos/store/store";
import z from "zod/v3";
import { type StateCreator } from "zustand";

export const paymentMethodSchema = z.enum(["CASH", "GCASH", "CREDIT_USED"]);

export const paymentEntrySchema = z.object({
  id: z.string().uuid(),
  paymentMethod: paymentMethodSchema,
  amount: z.number().positive(),
});

export type PaymentEntry = z.infer<typeof paymentEntrySchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type PaymentState = {
  payments: PaymentEntry[];
};

export type PaymentActions = {
  addPayment: (entry: PaymentEntry) => void;
  removePayment: (id: string) => void;
  clearPayments: () => void;
};

export type PaymentSlice = PaymentState & PaymentActions;

const initialState: PaymentState = {
  payments: [],
};

export const createPaymentSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  PaymentSlice
> = (set) => ({
  ...initialState,
  addPayment: (entry) =>
    set((s) => {
      s.payments.push(entry);

      const totalAmount = s.items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const difference = totalAmount - totalPaid;

      if (difference <= 0) s.allowDebt = false;
      if (difference >= 0) s.storeChangeAsCredit = false;
    }),
  removePayment: (id) =>
    set((s) => {
      s.payments = s.payments.filter((e) => e.id !== id);
      const totalAmount = s.items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const difference = totalAmount - totalPaid;

      if (difference <= 0) s.allowDebt = false;
      if (difference >= 0) s.storeChangeAsCredit = false;
    }),
  clearPayments: () => set(() => initialState),
});
