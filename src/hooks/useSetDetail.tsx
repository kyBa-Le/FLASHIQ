// src/hooks/useSetDetail.ts
import { CardService } from "@/services/card.service";
import { SetService } from "@/services/set.service";
import { useSetStore } from "@/store/set.store"; // Import store
import type { CardItem, SetItem } from "@/types/types";
import { useEffect, useRef, useState, useCallback } from "react";

export function useSetDetail(setId?: string) {
  const fetchedRef = useRef<string | null>(null);
  const [set, setSet] = useState<SetItem | null>(null);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy các hàm từ Zustand
  const updateCountsCache = useSetStore((s) => s.updateCountsCache);
  const removeSetFromStore = useSetStore((s) => s.removeSet);

  const fetchData = useCallback(async () => {
    if (!setId) return;
    setLoading(true);
    try {
      const [setRes, cardsRes] = await Promise.all([
        SetService.getSetById(setId),
        SetService.getSetCards(setId),
      ]);

      setSet(setRes.data);
      setCards(cardsRes.data);

      updateCountsCache(setId, cardsRes.data.length);
    } catch (err) {
      console.error("Failed to fetch set detail", err);
    } finally {
      setLoading(false);
    }
  }, [setId, updateCountsCache]);

  useEffect(() => {
    if (!setId || fetchedRef.current === setId) return;
    fetchedRef.current = setId;
    fetchData();
  }, [setId, fetchData]);

  const deleteSet = async () => {
    if (!setId) return false;
    try {
      await SetService.deleteSet(setId);
      removeSetFromStore(setId); 
      return true;
    } catch (err) {
      console.error("Delete set error:", err);
      return false;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await CardService.deleteCard(cardId);
      const newCards = cards.filter((c) => c.id !== cardId);
      setCards(newCards);
      updateCountsCache(setId!, newCards.length);
      return true;
    } catch (err) {
      console.error("Delete card error:", err);
      return false;
    }
  };

  return { set, cards, loading, refresh: fetchData, deleteSet, deleteCard };
}
