import { useAppStore } from "@/features/pos/store/store";
import { useShallow } from "zustand/react/shallow";

export const usePayments = () => useAppStore((s) => s.payments);

export const useCartTotal = () =>
  useAppStore((s) =>
    s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  );

export const useTotalPaid = () =>
  useAppStore((s) => s.payments.reduce((sum, p) => sum + p.amount, 0));

export const useDifference = () =>
  useAppStore((s) => {
    const totalAmount = s.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );
    const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
    return totalAmount - totalPaid;
  });

export const usePaymentStatus = () =>
  useAppStore(
    useShallow((s) => {
      const totalAmount = s.items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const difference = totalAmount - totalPaid;

      return {
        totalAmount,
        totalPaid,
        difference,
        isDebt: difference > 0,
        isOverPaid: difference < 0,
        isExactPay: difference === 0,
      };
    }),
  );

export const usePaymentActions = () =>
  useAppStore(
    useShallow((s) => ({
      add: s.addPayment,
      remove: s.removePayment,
      clearPayments: s.clearPayments,
    })),
  );
