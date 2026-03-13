import type { StateCreator } from "zustand";

type CartItem = {
  variantId: number;
  sku: string;
  size: string | null;
  flavor: string | null;
  packaging: string | null;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartActions = {
  add: (item: CartItem) => void;
  remove: (variantId: number) => void;
  increment: (variantId: number) => void;
  decrement: (variantId: number) => void;
  clearCart: () => void;
};

export type CartSlice = CartState & CartActions;

const initialState: CartState = {
  items: [],
};

export const createCartSlice: StateCreator<
  CartSlice,
  [["zustand/immer", never]],
  [],
  CartSlice
> = (set) => ({
  ...initialState,
  add: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    }),
  remove: (variantId) =>
    set((state) => {
      state.items = state.items.filter((i) => i.variantId !== variantId);
    }),
  increment: (variantId) =>
    set((state) => {
      const item = state.items.find((i) => i.variantId === variantId);
      if (item) {
        item.quantity += 1;
      }
    }),
  decrement: (variantId) =>
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
});
