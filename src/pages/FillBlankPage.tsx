/* eslint-disable react-hooks/purity */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { RichContent } from "@/components/card-content/RichContent";
import { ProgressStep } from "@/components/study/ProgressStep";
import { QuizHeader } from "@/components/common/QuizHeader";
import NotEnoughCardsState from "@/components/study/EmptyStateQuiz";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";

import { SetService } from "@/services/set.service";
import { QuizCrypto } from "@/utils/crypto";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuizAnswer } from "@/hooks/useQuizAnswer";

import { QUIZ_MODE } from "@/constants/quiz.constant";
import type { CardItem } from "@/types/card.type";

export default function FillBlankPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mode = QUIZ_MODE.FILL_BLANK;

  const {
    currentQuiz,
    loading,
    error,
    notEnoughCards,
    next,
    processAnswer,
    answeredCount,
    total,
    isCompleted,
    closeSummary,
  } = useQuiz(id, mode);

  const { isAnswered, feedback, submitAnswer, resetAnswer } = useQuizAnswer(
    mode,
    processAnswer
  );

  const [cards, setCards] = useState<CardItem[]>([]);
  const [answerInput, setAnswerInput] = useState("");
  const [isDontKnow, setIsDontKnow] = useState(false);

  useEffect(() => {
    if (!id) return;
    SetService.getSetCards(id).then((res) => setCards(res.data));
  }, [id]);

  const currentCard = useMemo(() => {
    return cards.find((c) => c.id === currentQuiz?.cardId);
  }, [cards, currentQuiz]);

  const isCorrect = feedback?.includes("Correct") || isDontKnow;

  const handleSubmit = (isIDK = false) => {
    if (!currentQuiz || isAnswered) return;

    if (isIDK && currentCard) {
      setIsDontKnow(true);
      setAnswerInput(currentCard.definition);
    }

    const userAnswer = isIDK ? "" : answerInput.trim();
    const correct =
      !isIDK && QuizCrypto.isCorrect(userAnswer, currentQuiz.correctAnswer);

    submitAnswer({
      cardId: currentQuiz.cardId,
      isCorrect: correct,
      isIDK,
    });
  };

  const handleNext = () => {
    next();
    setAnswerInput("");
    setIsDontKnow(false);
    resetAnswer();
  };

  const handleDone = () => {
    closeSummary();
    navigate("/library");
  };

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading quiz...</div>;
  }

  if (notEnoughCards) {
    return <NotEnoughCardsState onBack={() => navigate(-1)} />;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (isCompleted) {
    return <StudySummaryModal open onClose={handleDone} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-none p-4 z-10">
        <QuizHeader title="Fill in Blank" onClose={() => navigate(-1)} />
        <div className="max-w-4xl mx-auto">
          <ProgressStep score={answeredCount} total={total} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-8">
        <div className="max-w-4xl mx-auto py-8">
          <Card className="rounded-2xl border-gray-300 bg-white p-6">
            <RichContent
              header={
                <span className="text-md font-black tracking-widest">Term</span>
              }
              title={
                <p className="mt-4 text-lg font-medium">{currentQuiz?.term}</p>
              }
              body={
                <div className="mt-4 space-y-3">
                  {isAnswered && feedback && (
                    <p
                      className={`text-sm font-semibold text-center animate-in fade-in ${
                        feedback.includes("Correct")
                          ? "text-green-700"
                          : feedback.includes("Try")
                          ? "text-yellow-700"
                          : "text-red-600"
                      }`}
                    >
                      {feedback}
                    </p>
                  )}

                  <div className="relative">
                    {isAnswered && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {isCorrect ? <Check size={20} /> : <X size={20} />}
                      </span>
                    )}

                    <input
                      type="text"
                      value={answerInput}
                      disabled={isAnswered}
                      placeholder="Enter definition"
                      onChange={(e) => setAnswerInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className={`w-full py-3 pr-3 text-lg rounded-lg border-2 focus:outline-none transition-all
                        ${
                          isAnswered
                            ? isCorrect
                              ? "border-green-500 bg-green-50 pl-10"
                              : "border-red-400 bg-red-50 pl-10"
                            : "border-gray-300 pl-3"
                        }
                      `}
                    />
                  </div>

                  {isAnswered && !isCorrect && !isDontKnow && currentCard && (
                    <>
                      <span className="text-sm font-semibold">
                        Correct Answer
                      </span>
                      <div className="flex items-center gap-2 p-3 border-2 border-green-400 rounded-lg bg-green-50">
                        <Check /> {currentCard.definition}
                      </div>
                    </>
                  )}
                </div>
              }
              footer={
                <div className="flex items-center justify-end gap-6 mt-4">
                  {!isAnswered ? (
                    <>
                      <button
                        onClick={() => handleSubmit(true)}
                        className="text-sm font-bold underline"
                      >
                        Don’t know?
                      </button>

                      <Button
                        className="rounded-full"
                        disabled={!answerInput.trim()}
                        onClick={() => handleSubmit(false)}
                      >
                        Answer
                      </Button>
                    </>
                  ) : (
                    <Button className="rounded-full" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
