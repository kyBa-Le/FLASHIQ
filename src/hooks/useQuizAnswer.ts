import { useState } from "react";
import { StudyService } from "@/services/study.service";
import type { QuizMode } from "@/types/quiz.type";

export function useQuizAnswer(_mode: QuizMode, processAnswer: (correct: boolean) => void) {

  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submitAnswer = async ({
    cardId,
    isCorrect,
    isIDK = false,
  }: {
    cardId: string;
    isCorrect: boolean;
    isIDK?: boolean;
  }) => {
    if (isAnswered) return;

    setIsAnswered(true);

    setFeedback(
      isCorrect
        ? "Correct! ✨"
        : isIDK
        ? "Try to memorize this term!"
        : "Don't worry, keep going! 🤞"
    );

    await StudyService.updateStudyRecordScore({
      cardId,
      isCorrect,
    });

    processAnswer(isCorrect);
  };

  const resetAnswer = () => {
    setIsAnswered(false);
    setFeedback(null);
  };

  return {
    isAnswered,
    feedback,
    submitAnswer,
    resetAnswer,
  };
}
