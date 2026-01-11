/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { StudyService } from "@/services/study.service";
import type { QuizDto, QuizMode } from "@/types/quiz.type";

export const useQuiz = (setId?: string, mode?: QuizMode) => {
  const [quizList, setQuizList] = useState<QuizDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answeredCount, setAnsweredCount] = useState(0);
  const [pendingResult, setPendingResult] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notEnoughCards, setNotEnoughCards] = useState(false);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const totalRef = useRef(0);

  useEffect(() => {
    if (!setId) return;

    StudyService.getStudyProgress(setId)
      .then(() => setInitialized(true))
      .catch(() => setError("Failed to initialize study progress"));
  }, [setId]);

  const fetchQuiz = useCallback(async () => {
    if (!setId || !mode || !initialized) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await StudyService.getQuizCard(setId, mode);
      const data = res.data || [];

      if (!data.length) {
        setError("This set is empty");
        return;
      }

      setQuizList(data);
      setCurrentIndex(0);
      setAnsweredCount(0);
      setPendingResult(null);
      totalRef.current = data.length;
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
  }, [setId, mode, initialized]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const processAnswer = (isCorrect: boolean) => {
    setPendingResult(isCorrect);
  };
  const next = () => {
    if (pendingResult === null) return false;

    const current = quizList[currentIndex];
    const rest = quizList.filter((_, i) => i !== currentIndex);

    if (pendingResult) {
      setAnsweredCount((prev) => prev + 1);
      setQuizList(rest);
    } else {
      setQuizList([...rest, current]);
    }

    setPendingResult(null);
    setCurrentIndex(0);
    return true;
  };

  const isCompleted =
    totalRef.current > 0 &&
    quizList.length === 0 &&
    answeredCount === totalRef.current;

  // useEffect(() => {
  //   if (isCompleted) setSummaryOpen(true);
  // }, [isCompleted]);

  const resetQuiz = () => {
    fetchQuiz();
  };
  return {
    currentQuiz: quizList[currentIndex] || null,

    loading,
    error,
    notEnoughCards,

    processAnswer,
    next,

    answeredCount,
    total: totalRef.current,
    isCompleted,
    resetQuiz,
    summaryOpen,
    closeSummary: () => setSummaryOpen(false),
  };
};
