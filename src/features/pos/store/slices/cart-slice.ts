import type { Store } from "@/features/pos/store/store";
import type { StateCreator } from "zustand";

export type CartItem = {
  variantId: number;
  productName: string;
  sku: string;
  size: string | null;
  flavor: string | null;
  packaging: string | null;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  incrementItem: (variantId: number) => void;
  decrementItem: (variantId: number) => void;
  clearCart: () => void;
  setItemQuantity: (variantId: number, quantity: number) => void;
};

export type CartSlice = CartState & CartActions;

const initialState: CartState = {
  items: [],
};

export const createCartSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  CartSlice
> = (set) => ({
  ...initialState,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    }),
  removeItem: (variantId) =>
    set((state) => {
      state.items = state.items.filter((i) => i.variantId !== variantId);
    }),
  incrementItem: (variantId) =>
    set((state) => {
      const item = state.items.find((i) => i.variantId === variantId);
      if (item) {
        item.quantity += 1;
      }
    }),
  decrementItem: (variantId) =>
    set((state) => {
      const item = state.items.find((i) => i.variantId === variantId);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.variantId !== variantId);
      } else {
        item.quantity -= 1;
      }
    }),
  clearCart: () => set(() => initialState),
  setItemQuantity: (variantId, quantity) =>
    set((state) => {
      const item = state.items.find((i) => i.variantId === variantId);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.variantId !== variantId);
      } else {
        item.quantity = Math.min(quantity, item.stockQuantity);
      }
    }),
});
