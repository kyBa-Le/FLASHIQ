/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { StudyService } from "@/services/study.service";
import type { QuizDto } from "@/types/quiz.type";

export const useQuiz = (setId?: string) => {
  const [quizList, setQuizList] = useState<QuizDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notEnoughCards, setNotEnoughCards] = useState(false);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!setId) return;

    const init = async () => {
      try {
        await StudyService.getStudyProgress(setId);
        setInitialized(true);
      } catch {
        setError("Failed to initialize study progress");
      }
    };

    init();
  }, [setId]);

  const fetchQuiz = useCallback(async () => {
    if (!setId || !initialized) return;

    try {
      setLoading(true);
      const res = await StudyService.getQuizCard(setId);
      const data = res?.data || [];

      if (!data.length) {
        setError("This set is empty");
        return;
      }

      setQuizList(data);
      setCurrentIndex(0);
      setAnsweredCount(0);
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("not enough")) {
        setNotEnoughCards(true);
      } else {
        setError(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [setId, initialized]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const answer = () => {
    setAnsweredCount((prev) => prev + 1);
  };

  const next = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const complete = () => {
    setSummaryOpen(true);
  };

  return {
    currentQuiz: quizList[currentIndex] || null,

    loading,
    error,
    notEnoughCards,

    answer,
    next,
    complete,

    answeredCount,
    total: quizList.length,
    isLast: answeredCount === quizList.length,

    summaryOpen,
    closeSummary: () => setSummaryOpen(false),
  };
};
