import { SetService } from "@/services/set.service";
import type { CardItem } from "@/types/types";
import { create } from "zustand";

type CardState = {
  cards: Record<string, CardItem[]>;
  fetchCards: (setId: string) => Promise<void>;
};

export const useCardStore = create<CardState>((set) => ({
  cards: {},

  fetchCards: async (setId) => {
    const res = await SetService.getSetCards(setId);
    set((s) => ({
      cards: { ...s.cards, [setId]: res.data },
    }));
  },
}));
