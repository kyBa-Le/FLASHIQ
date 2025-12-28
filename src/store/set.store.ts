import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SetItem } from "@/types/types";

interface SetStore {
  sets: SetItem[];
  total: number;
  countsCache: Record<string, number>;

  setSets: (sets: SetItem[]) => void;
  setTotal: (total: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSet: (newSet: any) => void;
  updateCountsCache: (setId: string, count: number) => void;
  removeSet: (setId: string) => void;
  reset: () => void;
}

export const useSetStore = create<SetStore>()(
  persist(
    (set) => ({
      sets: [],
      total: 0,
      countsCache: {},

      setSets: (sets) => set({ sets }),
      setTotal: (total) => set({ total }),

      updateCountsCache: (setId, count) =>
        set((state) => ({
          countsCache: { ...state.countsCache, [setId]: count },
        })),

      addSet: (newSet) =>
        set((state) => {
          const updatedCache = {
            ...state.countsCache,
            [newSet.id]: newSet.cardCount,
          };
          return {
            sets: [newSet, ...state.sets],
            total: state.total + 1,
            countsCache: updatedCache,
          };
        }),
      removeSet: (setId) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== setId),
          total: state.total > 0 ? state.total - 1 : 0,
        })),

      reset: () => set({ sets: [], total: 0, countsCache: {} }),
    }),
    {
      name: "set-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ countsCache: state.countsCache }),
    }
  )
);
