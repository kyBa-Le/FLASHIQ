import { useEffect, useState, useCallback } from "react";
import { SetService } from "@/services/set.service";
import { useSetStore } from "@/store/set.store";

export const useUserSets = (userId: string | undefined, page: number) => {
  const [loading, setLoading] = useState(false);
  const { setSets, setTotal } = useSetStore();

  const fetchSets = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await SetService.getMySets(userId, page);

      const apiSets = res.sets || res.sets || [];
      const apiTotal =
        res.pagination?.total || res.pagination?.total || apiSets.length;

      setSets(apiSets);
      setTotal(apiTotal);
    } catch (error) {
      console.error("Fetch sets error:", error);
      setSets([]);
    } finally {
      setLoading(false);
    }
  }, [userId, page, setSets, setTotal]);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  return { loading, refresh: fetchSets };
};
