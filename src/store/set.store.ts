import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SetItem } from "@/types/types";

interface SetStore {
  sets: SetItem[];
  total: number;

  setSets: (sets: SetItem[]) => void;
  setTotal: (total: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSet: (newSet: any) => void;
  removeSet: (setId: string) => void;
  reset: () => void;
}

export const useSetStore = create<SetStore>()(
  persist(
    (set) => ({
      sets: [],
      total: 0,

      setSets: (sets) => set({ sets }),
      setTotal: (total) => set({ total }),

      addSet: (newSet) =>
        set((state) => {
          return {
            sets: [newSet, ...state.sets],
            total: state.total + 1,
          };
        }),
      removeSet: (setId) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== setId),
          total: state.total > 0 ? state.total - 1 : 0,
        })),

      reset: () => set({ sets: [], total: 0 }),
    }),
    {
      name: "set-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
