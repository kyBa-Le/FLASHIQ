/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FlashCard from "@/components/learn/FlashCard";
import FlashcardControls from "@/components/learn/FlashcardControls";
import { getCardsBySet } from "@/services/card.service";
import { SetService } from "@/services/set.service";
import { QuizHeader } from "@/components/common/QuizHeader";
import type { Card } from "@/types/card.type";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";

import { useStudyProgress } from "@/hooks/useStudyProgress";
import { useQuizAnswer } from "@/hooks/useQuizAnswer";
import { QUIZ_MODE } from "@/constants/quiz.constant";
import { StudyMode, STUDY_MODES } from "@/constants/studyMode";

export default function FlashCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setTitle, setSetTitle] = useState("");
  const [trackProgress, setTrackProgress] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mode = useMemo(() => {
    if (!location.pathname || !id) return StudyMode.FLASHCARD;
    const found = STUDY_MODES.find((m) =>
      location.pathname.includes(m.path.replace(":id", id))
    );
    return found?.key ?? StudyMode.FLASHCARD;
  }, [location.pathname, id]);

  const { refresh } = useStudyProgress(id);
  const { submitAnswer, resetAnswer } = useQuizAnswer(
    QUIZ_MODE.FLASHCARD,
    () => {
      if (trackProgress) refresh();
    }
  );

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoadingCards(true);
        const set = await SetService.getSetById(id);
        const cardsData = await getCardsBySet(id);

        setSetTitle(set.title);
        setCards(cardsData);
        setOriginalCards(cardsData);
      } catch (err) {
        console.error("Failed to load set", err);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    resetAnswer();
  }, [currentIndex, resetAnswer]);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const nextCard = () => {
    setCurrentIndex((i) => (i < cards.length - 1 ? i + 1 : i));
  };

  const handleFlippedToBack = () => {
    if (!isPlaying) return;
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => nextCard(), 3000);
  };

  const showOverlayAndNext = (text: string) => {
    setOverlayText(text);
    setIsPlaying(false);

    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);

    overlayTimerRef.current = setTimeout(() => {
      setOverlayText(null);
      if (isLastCard) {
        setShowFinishModal(true);
      } else {
        nextCard();
      }
    }, 600);
  };

  const handleMarkLearned = () => {
    if (!currentCard) return;
    submitAnswer({ cardId: currentCard.id, isCorrect: true });
    showOverlayAndNext("✅ Learned");
  };

  const handleMarkLearning = () => {
    if (!currentCard) return;
    submitAnswer({ cardId: currentCard.id, isCorrect: false });
    showOverlayAndNext("📖 Learning");
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setCards(originalCards);
    } else {
      setCards([...cards].sort(() => Math.random() - 0.5));
    }
    setIsShuffled((p) => !p);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  if (loadingCards)
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Loading cards...
      </div>
    );
  if (!cards.length)
    return (
      <div className="h-screen flex items-center justify-center">
        No cards in this set
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header section */}
      <div className="flex-none p-4">
        <QuizHeader
          title="Memory Card"
          onClose={() => navigate(`/sets/${id}/study`)}
        />
        <div className="mt-2 text-center">
          <h1 className="text-sm font-semibold text-gray-700">{setTitle}</h1>
          <p className="text-xs text-gray-500">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 mb-6 md:mx-24">
        {mode === StudyMode.FLASHCARD && currentCard && (
          <FlashCard
            key={currentCard.id}
            card={currentCard}
            className="h-full w-full max-w-4xl"
            autoFlip={isPlaying}
            onFlippedToBack={handleFlippedToBack}
            overlayText={overlayText}
          />
        )}
      </div>

      <div className="flex-none bg-white px-4 py-3 mb-6 md:mx-24 border-t">
        <FlashcardControls
          currentIndex={currentIndex}
          total={cards.length}
          trackProgress={trackProgress}
          onToggleTrackProgress={() => {
            setTrackProgress((p) => !p);
            setIsPlaying(false);
          }}
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          onNext={nextCard}
          onMarkLearned={handleMarkLearned}
          onMarkLearning={handleMarkLearning}
          onShuffle={toggleShuffle}
          isFullscreen={true} 
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      </div>

      <StudySummaryModal
        open={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="🎉 Great job!"
        description="You’ve reviewed all flashcards in this set."
        primaryAction={{
          label: "Study again",
          onClick: () => {
            setCurrentIndex(0);
            setShowFinishModal(false);
          },
        }}
        secondaryAction={{
          label: "Back to sets",
          onClick: () => navigate(`/sets/${id}/study`),
        }}
      />
    </div>
  );
}
