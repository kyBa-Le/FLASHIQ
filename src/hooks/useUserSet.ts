import { SetService } from "@/services/set.service";
import { useSetStore } from "@/store/set.store";
import { useCallback, useEffect, useState } from "react";

export const useUserSets = (userId: string | undefined, page: number) => {
  const [loading, setLoading] = useState(false);
  const setSets = useSetStore((s) => s.setSets);
  const setTotal = useSetStore((s) => s.setTotal);

  const fetchSets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await SetService.getMySets(userId, page);
      setSets(res.sets || []);
      setTotal(res.pagination?.total || 0);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, page, setSets, setTotal]);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  return { loading, refresh: fetchSets };
};
