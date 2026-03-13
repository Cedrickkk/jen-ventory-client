import {
  type CartSlice,
  createCartSlice,
} from "@/features/pos/store/slices/cart-slice";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Store = CartSlice;

export const useAppStore = create<Store>()(
  immer((...a) => ({
    ...createCartSlice(...a),
  })),
);
