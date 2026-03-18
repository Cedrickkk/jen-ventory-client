import { useAppStore } from "@/features/pos/store/store";
import { useShallow } from "zustand/react/shallow";

export const useActiveTab = () => useAppStore((s) => s.activeTab);
export const useIsSubmitting = () => useAppStore((s) => s.isSubmitting);

export const useCanSubmit = () =>
  useAppStore((s) => {
    if (s.items.length === 0) return false;
    if (s.isSubmitting) return false;

    const totalAmount = s.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );
    const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
    const difference = totalAmount - totalPaid;
    const isDebt = difference > 0;

    if (s.payments.length === 0) {
      if (!s.allowDebt) return false;
      if (s.selectedCustomer === null) return false;
    }

    if (isDebt && !s.allowDebt) return false;
    if (isDebt && s.selectedCustomer === null) return false;

    return true;
  });

export const useUIActions = () =>
  useAppStore(
    useShallow((s) => ({
      setActiveTab: s.setActiveTab,
    })),
  );
