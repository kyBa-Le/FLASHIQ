import { SetService } from "@/services/set.service";
import { useSetStore } from "@/store/set.store";
import type { CardItem, SetItem } from "@/types/types";
import { useEffect, useState, useCallback } from "react";

export function useSetDetail(setId?: string) {
  const [set, setSet] = useState<SetItem | null>(null);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const updateCountsCache = useSetStore((s) => s.updateCountsCache);
  const removeSetFromStore = useSetStore((s) => s.removeSet);

  const fetchData = useCallback(async () => {
    if (!setId) return;

    setLoading(true);
    setError(null);

    try {
      // Sử dụng Promise.all để lấy dữ liệu song song (chỉ 2 requests nên an toàn, không gây 429)
      const [setRes, cardsRes] = await Promise.all([
        SetService.getSetById(setId),
        SetService.getSetCards(setId),
      ]);

      const setData = setRes.data || setRes;
      const cardsData = cardsRes.data || [];

      setSet(setData);
      setCards(cardsData);

      updateCountsCache(setId, cardsData.length);
    } catch (err) {
      console.error("Failed to fetch set detail", err);
      setError("Failed to load set details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [setId, updateCountsCache]);

  useEffect(() => {
    if (setId) {
      fetchData();
    }
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
    if (!setId) return false;
    try {
      const newCards = cards.filter((c) => c.id !== cardId);
      setCards(newCards);
      updateCountsCache(setId, newCards.length); 
      return true;
    } catch (err) {
      console.error("Delete card error:", err);
      return false;
    }
  };

  return {
    set,
    cards,
    loading,
    error,
    refresh: fetchData,
    deleteSet,
    deleteCard,
  };
}
