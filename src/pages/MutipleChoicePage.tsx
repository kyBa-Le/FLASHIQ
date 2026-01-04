/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { AnswerOption } from "@/components/study/AnswerOption";
import { RichContent } from "@/components/card-content/RichContent";
import { ProgressStep } from "@/components/study/ProgressStep";
import { QuizHeader } from "@/components/common/QuizHeader";
import { StudyService } from "@/services/study.service";
import { QuizCrypto } from "@/utils/crypto";
import { useQuiz } from "@/hooks/useQuiz";
import NotEnoughCardsState from "@/components/study/EmptyStateQuiz";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";

export default function MultipleChoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentQuiz,
    loading,
    notEnoughCards,
    error,
    next,
    complete,
    answer,
    answeredCount,
    total,
    isLast,
    summaryOpen,
    closeSummary,
  } = useQuiz(id);

  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const correctValue = useMemo(() => {
    if (!currentQuiz?.choices) return null;
    return (
      currentQuiz.choices.find((opt) =>
        QuizCrypto.isCorrect(opt, currentQuiz.correctAnswer)
      ) || null
    );
  }, [currentQuiz]);

  const shuffledChoices = useMemo(() => {
    if (!currentQuiz?.choices) return [];
    return [...currentQuiz.choices].sort(() => Math.random() - 0.5);
  }, [currentQuiz]);

  const handleSelect = async (choice: string) => {
    if (isAnswered || !currentQuiz) return;

    const isIDK = choice === "___IDK___";
    const isCorrect =
      !isIDK && QuizCrypto.isCorrect(choice, currentQuiz.correctAnswer);

    setIsAnswered(true);
    setSelected(isIDK ? null : choice);
    answer();

    setFeedback(
      isCorrect
        ? "Correct! ✨"
        : isIDK
        ? "Try to memorize this term!"
        : "Don't worry, keep going! 🤞"
    );

    await StudyService.updateStudyRecordScore({
      cardId: currentQuiz.cardId,
      isCorrect,
    });
  };

  const handleNext = () => {
    if (isLast) {
      complete();
      return;
    }

    next();
    setIsAnswered(false);
    setSelected(null);
    setFeedback(null);
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

  return (
    <>
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <div className="flex-none p-4 z-10">
          <QuizHeader title="Multiple Choice" onClose={() => navigate(-1)} />
          <div className="max-w-4xl mx-auto">
            <ProgressStep score={answeredCount} total={total} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-8">
          <div className="max-w-4xl mx-auto py-2">
            <Card className="rounded-[32px] border-gray-300 bg-white p-0 sm:p-3">
              <RichContent
                header={
                  <span className="text-md font-black tracking-widest">
                    Term
                  </span>
                }
                title={
                  <div className="space-y-6 mt-12">
                    <div className="flex justify-between items-start gap-6">
                      <div>
                        <p className="font-medium text-xl flex-1">
                          {currentQuiz.term}
                        </p>
                        <p className="text-sm text-gray-700 flex-1 mt-2">
                          {currentQuiz.example ?? "No example provide"}
                        </p>
                      </div>
                      {currentQuiz.image_url && (
                        <img
                          src={currentQuiz.image_url}
                          className="w-20 h-20 shrink-0"
                          alt="quiz-img"
                        />
                      )}
                    </div>

                    <div className="min-h-[20px]">
                      {!isAnswered && (
                        <p className="text-sm text-slate-500">
                          Choose correct answer
                        </p>
                      )}
                    </div>
                  </div>
                }
                body={
                  <div className="space-y-4 pt-2">
                    {isAnswered && feedback && (
                      <div
                        className={`text-sm font-semibold text-center animate-in fade-in ${
                          feedback.includes("Correct")
                            ? "text-green-700"
                            : feedback.includes("Try")
                            ? "text-yellow-700"
                            : "text-red-600"
                        }`}
                      >
                        {feedback}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shuffledChoices.map((opt, i) => {
                        let state:
                          | "default"
                          | "selected"
                          | "correct"
                          | "wrong" = "default";

                        if (isAnswered) {
                          if (correctValue === opt) state = "correct";
                          else if (selected === opt) state = "wrong";
                        } else if (selected === opt) {
                          state = "selected";
                        }

                        return (
                          <AnswerOption
                            key={i}
                            label={opt}
                            state={state}
                            disabled={isAnswered}
                            onClick={() => handleSelect(opt)}
                          />
                        );
                      })}
                    </div>
                  </div>
                }
                footer={
                  <div className="flex justify-end mt-4 min-h-[60px]">
                    {!isAnswered ? (
                      <button
                        onClick={() => handleSelect("___IDK___")}
                        className="underline text-sm font-bold"
                      >
                        Don't know?
                      </button>
                    ) : (
                      <Button onClick={handleNext} className="rounded-full">
                        {isLast ? "Complete" : "Next"}
                      </Button>
                    )}
                  </div>
                }
              />
            </Card>
          </div>
        </div>
      </div>

      <StudySummaryModal open={summaryOpen} onClose={handleDone} />
    </>
  );
}
