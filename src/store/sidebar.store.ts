import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  close: () => set({ isCollapsed: true }),
  open: () => set({ isCollapsed: false }),
  setCollapsed: (v) => set({ isCollapsed: v }),
}));
