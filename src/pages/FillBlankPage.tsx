/* eslint-disable react-hooks/purity */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { RichContent } from "@/components/card-content/RichContent";
import { ProgressStep } from "@/components/study/ProgressStep";
import { QuizHeader } from "@/components/common/QuizHeader";
import NotEnoughCardsState from "@/components/study/EmptyStateQuiz";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";

import { QuizCrypto } from "@/utils/crypto";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuizAnswer } from "@/hooks/useQuizAnswer";
import { CardService } from "@/services/card.service";

import { QUIZ_MODE } from "@/constants/quiz.constant";

export default function FillBlankPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mode = QUIZ_MODE.FILL_BLANK;

  const {
    currentQuiz,
    error,
    notEnoughCards,
    next,
    processAnswer,
    answeredCount,
    total,
    isCompleted,
    loading,
    closeSummary,
    resetQuiz,
  } = useQuiz(id, mode);

  const { isAnswered, feedback, submitAnswer, resetAnswer } = useQuizAnswer(
    mode,
    processAnswer
  );

  const [answerInput, setAnswerInput] = useState("");
  const [isDontKnow, setIsDontKnow] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const isCorrect = useMemo(
    () => feedback?.includes("Correct") ?? false,
    [feedback]
  );

  const normalizeAnswer = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

  const handleSubmit = async (isIDK = false) => {
    if (!currentQuiz || isAnswered) return;

    if (isIDK) {
      setIsDontKnow(true);

      try {
        const res = await CardService.getCardById(currentQuiz.cardId);
        const definition = res.data.data.definition;

        setCorrectAnswer(definition);
        setAnswerInput(definition);
      } catch (err) {
        console.error("Fetch card failed", err);
      }

      submitAnswer({
        cardId: currentQuiz.cardId,
        isCorrect: false,
        isIDK: true,
      });

      return;
    }

    const correct = QuizCrypto.isCorrect(
      normalizeAnswer(answerInput),
      currentQuiz.correctAnswer
    );

    if (correct) {
      submitAnswer({
        cardId: currentQuiz.cardId,
        isCorrect: true,
        isIDK: false,
      });
      return;
    }

    try {
      const res = await CardService.getCardById(currentQuiz.cardId);
      setCorrectAnswer(res.data.data.definition);
    } catch (err) {
      console.error("Fetch card failed", err);
    }

    submitAnswer({
      cardId: currentQuiz.cardId,
      isCorrect: false,
      isIDK: false,
    });
  };

  const handleNext = () => {
    next();
    setAnswerInput("");
    setIsDontKnow(false);
    setCorrectAnswer(null);
    resetAnswer();
  };

  const handleDone = () => {
    closeSummary();
    navigate(`/sets/${id}/study`);
  };

  if (notEnoughCards)
    return <NotEnoughCardsState onBack={() => navigate(-1)} />;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (loading) {
    return <p className="text-center mt-10 text-slate-400">Loading quiz...</p>;
  }
  const handleReviewAgain = () => {
    resetQuiz();
    resetAnswer();
    setCorrectAnswer(null);
  };

  return (
    <>
      {!isCompleted && currentQuiz && (
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="flex-none p-4 z-10">
            <QuizHeader title="Fill in Blank" onClose={() => navigate(-1)} />
            <div className="max-w-4xl mx-auto">
              <ProgressStep score={answeredCount} total={total} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-8 flex items-center">
            <div className="max-w-4xl mx-auto py-8 w-full">
              <Card className="rounded-2xl border-gray-300 bg-white p-6">
                <RichContent
                  header={
                    <span className="grid grid-cols-2 items-center gap-4 font-bold">
                      Term
                    </span>
                  }
                  title={
                    <div className="grid grid-cols-2 items-center gap-6 mt-4">
                      <p className="text-lg font-medium">{currentQuiz?.term}</p>
                      {currentQuiz.image_url && (
                        <img
                          src={currentQuiz.image_url}
                          className="w-35 h-35 shrink-0 justify-self-center rounded-sm"
                          alt="quiz-img"
                        />
                      )}
                    </div>
                  }
                  body={
                    <div className="mt-6 space-y-3">
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
                            {isCorrect || isDontKnow ? (
                              <Check size={20} />
                            ) : (
                              <X size={20} />
                            )}
                          </span>
                        )}

                        <input
                          type="text"
                          value={answerInput}
                          disabled={isAnswered}
                          placeholder="Enter definition"
                          onChange={(e) => setAnswerInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isDontKnow) {
                              handleSubmit(false);
                            }
                          }}
                          className={`w-full py-3 pr-3 text-lg rounded-lg border-2 focus:outline-none transition-all
                        ${
                          isAnswered
                            ? isCorrect || isDontKnow
                              ? "border-green-500 bg-green-50 pl-10"
                              : "border-red-400 bg-red-50 pl-10"
                            : "border-gray-300 pl-3"
                        }
                      `}
                        />
                      </div>

                      {isAnswered && !isCorrect && !isDontKnow && (
                        <>
                          <span className="text-sm font-semibold">
                            Correct Answer
                          </span>
                          <div className="flex items-center gap-2 p-3 border-2 border-green-400 rounded-lg bg-green-50 mt-2">
                            <Check /> {correctAnswer}
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
      )}

      <StudySummaryModal
        open={isCompleted}
        onClose={handleDone}
        title="🎉 Quiz completed!"
        description={`You answered ${answeredCount}/${total} questions.`}
        primaryAction={{
          label: "Review again",
          onClick: () => {
            handleReviewAgain();
          },
        }}
        secondaryAction={{
          label: "Back to sets",
          onClick: handleDone,
        }}
      />
    </>
  );
}
