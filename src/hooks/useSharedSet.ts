import { SetService } from "@/services/set.service";
import { useCallback, useEffect, useState } from "react";

export const useSharedSets = (userId: string | undefined, page: number) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sets: [] as any[],
    total: 0,
  });

  const fetchSharedSets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await SetService.getSharedSets(userId, page);
      
      setData({
        sets: res.sets || [],
        total: res.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Fetch Shared Sets error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchSharedSets();
  }, [fetchSharedSets]);

  const removeSetFromState = (id: string) => {
    setData((prev) => ({
      ...prev,
      sets: prev.sets.filter((s) => s.id !== id),
      total: prev.total - 1,
    }));
  };

  return { 
    loading, 
    sets: data.sets, 
    total: data.total, 
    refresh: fetchSharedSets,
    removeSet: removeSetFromState 
  };
};