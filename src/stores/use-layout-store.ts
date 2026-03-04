import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  isCompact: boolean;
  toggleLayout: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isCompact: false,
      toggleLayout: () => set((state) => ({ isCompact: !state.isCompact })),
    }),
    { name: "layout-storage" },
  ),
);
