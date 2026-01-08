/* eslint-disable react-hooks/purity */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { RichContent } from "@/components/card-content/RichContent";
import { ProgressStep } from "@/components/study/ProgressStep";
import { QuizHeader } from "@/components/common/QuizHeader";
import NotEnoughCardsState from "@/components/study/EmptyStateQuiz";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";

import { QuizCrypto } from "@/utils/crypto";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuizAnswer } from "@/hooks/useQuizAnswer";
import { QUIZ_MODE } from "@/constants/quiz.constant";

export default function TrueFalsePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mode = QUIZ_MODE.TRUE_FALSE;

  const {
    currentQuiz,
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

  const [userSelected, setUserSelected] = useState<boolean | null>(null);

  const displayMeaning = useMemo(() => {
    if (!currentQuiz?.choices || currentQuiz.choices.length === 0) return "";
    const index = answeredCount % currentQuiz.choices.length;
    return currentQuiz.choices[index];
  }, [currentQuiz, answeredCount]);

  const isStatementCorrect = useMemo(() => {
    if (!currentQuiz || !displayMeaning) return false;
    return QuizCrypto.isCorrect(displayMeaning, currentQuiz.correctAnswer);
  }, [currentQuiz, displayMeaning]);

  const handleSubmit = async (userChoice: boolean) => {
    if (!currentQuiz || isAnswered) return;

    const isUserRight = userChoice === isStatementCorrect;

    setUserSelected(userChoice);
    
    submitAnswer({
      cardId: currentQuiz.cardId,
      isCorrect: isUserRight,
      isIDK: false, 
    });
  };

  const handleNext = () => {
    next();
    setUserSelected(null);
    resetAnswer();
  };

  const handleDone = () => {
    closeSummary();
    navigate(`/sets/${id}/study`);
  };

  const getButtonStyle = (buttonType: boolean) => {
    if (!isAnswered) return "border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50";

    const isThisButtonLogicCorrect = (buttonType === isStatementCorrect);
    const isThisButtonSelected = (userSelected === buttonType);

    if (isThisButtonLogicCorrect) {
      return "border-green-500 text-green-600 bg-green-50/50";
    }
    if (isThisButtonSelected && !isThisButtonLogicCorrect) {
      return "border-red-400 text-red-500 bg-red-50/50";
    }
    return "border-gray-100 text-gray-300 opacity-50";
  };

  if (notEnoughCards) return <NotEnoughCardsState onBack={() => navigate(-1)} />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (isCompleted) return <StudySummaryModal open onClose={handleDone} />;
  if (!currentQuiz) return <div className="p-10 text-center font-semibold">Loading quiz...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <div className="flex-none p-4 z-10">
        <QuizHeader title="True/False" onClose={() => navigate(-1)} />
        <div className="max-w-4xl mx-auto">
          <ProgressStep score={answeredCount} total={total} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 flex items-center justify-center">
        <div className="max-w-4xl w-full py-4">
          <Card className="rounded-[32px] border-2 border-gray-100 bg-white p-8 md:p-12 min-h-[480px] flex flex-col">
            <RichContent
              header={<span className="font-bold text-gray-800 text-xl">Term</span>}
              title={
                <div className="flex justify-between items-start mt-6">
                  <div className="space-y-4">
                    <p className="text-xl font-medium text-gray-800">{currentQuiz.term}</p>
                    <p className="text-lg text-gray-500 italic">eg: {currentQuiz.example || "..."}</p>
                  </div>
                  {currentQuiz.image_url && (
                    <img src={currentQuiz.image_url} alt="quiz-img" className="w-40 h-auto object-contain rounded-xl" />
                  )}
                </div>
              }
              body={
                <div className="flex-1 flex flex-col justify-center my-10">
                  <h3 className="font-bold text-gray-800 text-xl mb-4">Meaning</h3>
                  <p className="text-lg text-gray-700 font-medium">{displayMeaning}</p>
                  
                  {isAnswered && feedback && (
                    <p className={`mt-4 text-sm font-bold animate-in fade-in duration-300 ${
                      feedback.includes("Correct") ? "text-green-600" : "text-red-500"
                    }`}>
                      {feedback}
                    </p>
                  )}
                </div>
              }
              footer={
                <div className="mt-auto">
                  <p className="font-bold text-gray-900 mb-6">Choose the correct answer.</p>
                  <div className="grid grid-cols-2 gap-6 mb-6">

                    <button
                      disabled={isAnswered}
                      onClick={() => handleSubmit(true)}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all text-lg font-bold ${getButtonStyle(true)}`}
                    >
                      {isAnswered && isStatementCorrect && <Check size={24} />}
                      {isAnswered && !isStatementCorrect && userSelected === true && <X size={24} />}
                      True
                    </button>

                    <button
                      disabled={isAnswered}
                      onClick={() => handleSubmit(false)}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all text-lg font-bold ${getButtonStyle(false)}`}
                    >
                      {isAnswered && !isStatementCorrect && <Check size={24} />}
                      {isAnswered && isStatementCorrect && userSelected === false && <X size={24} />}
                      False
                    </button>
                  </div>

                  <div className="flex justify-end min-h-[50px] items-center">
                    {!isAnswered ? (
                      <button 
                        onClick={() => handleSubmit(!isStatementCorrect)} 
                        className="text-purple-400 font-bold text-sm hover:underline pr-2"
                      >
                        You don't know?
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-12 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}