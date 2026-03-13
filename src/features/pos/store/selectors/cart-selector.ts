import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../store";

export const useCartItems = () => useAppStore((s) => s.items);
export const useCartCount = () => useAppStore((s) => s.items.length);
export const useCartTotal = () =>
  useAppStore((s) =>
    s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  );
export const useItemQuantity = (variantId: number) =>
  useAppStore(
    (s) => s.items.find((i) => i.variantId === variantId)?.quantity ?? 0,
  );
export const useIsInCart = (variantId: number) =>
  useAppStore((s) => s.items.some((i) => i.variantId === variantId));

export const useCartActions = () =>
  useAppStore(
    useShallow((s) => ({
      add: s.add,
      remove: s.remove,
      increment: s.increment,
      decrement: s.decrement,
      clearCart: s.clearCart,
    })),
  );
