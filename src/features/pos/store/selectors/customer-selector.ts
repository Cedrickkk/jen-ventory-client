import { useAppStore } from "@/features/pos/store/store";
import { useShallow } from "zustand/react/shallow";

export const useSelectedCustomer = () => useAppStore((s) => s.selectedCustomer);
export const useRepresentativeName = () =>
  useAppStore((s) => s.representativeName);
export const useCustomerActions = () =>
  useAppStore(
    useShallow((s) => ({
      setCustomer: s.setCustomer,
      setRepresentativeName: s.setRepresentativeName,
      clearCustomer: s.clearCustomer,
    })),
  );
