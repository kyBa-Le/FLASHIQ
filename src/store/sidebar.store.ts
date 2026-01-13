import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  close: () => set({ isCollapsed: true }),
}));
