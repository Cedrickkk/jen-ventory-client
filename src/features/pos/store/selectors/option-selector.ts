import { useAppStore } from "@/features/pos/store/store";
import { useShallow } from "zustand/react/shallow";

export const useAllowDebt = () => useAppStore((s) => s.allowDebt);
export const useStoreChangeAsCredit = () =>
  useAppStore((s) => s.storeChangeAsCredit);

export const useOptionActions = () =>
  useAppStore(
    useShallow((s) => ({
      toggleAllowDebt: s.toggleAllowDebt,
      toggleStoreCredit: s.toggleStoreCredit,
    })),
  );
