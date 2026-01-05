import { useState, useEffect} from "react";
import { SetService } from "@/services/set.service";

export const useSearchSets = (query: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller: AbortController | null = new AbortController();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const fetchData = async () => {
      if (!query.trim()) {
        setSets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await SetService.searchSets(query, controller?.signal);
        
        if (response && response.data) {
          setSets(response.data.sets);
        } else {
          setSets([]);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.name !== "CanceledError") console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    timer = setTimeout(fetchData, 500);

    return () => {
      if (timer) clearTimeout(timer);
      if (controller) controller.abort();
    };
  }, [query]); 

  return { sets, loading };
};