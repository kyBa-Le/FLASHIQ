/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { StudyService } from "@/services/study.service";
import { calculateLearningProgress } from "@/utils/calculateLearningProgress";

export const useStudyProgress = (setId?: string) => {
  const [studyProgress, setStudyProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const fetchProgress = useCallback(async () => {
    if (!setId) return;

    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await StudyService.getStudyProgress(setId);
      const cards = res.data || [];
      setStudyProgress(calculateLearningProgress(cards));
    } catch {
      setError("Failed to load study progress");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [setId]);

  useEffect(() => {
    const run = async () => {
      await fetchProgress();
    };

    run();
  }, [fetchProgress]);

  return {
    studyProgress,
    loading,
    error,
    refresh: fetchProgress,
  };
};
