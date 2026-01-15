/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { Card } from "@/types/card.type";
import { getCardsBySet } from "@/services/card.service";
import { SetService } from "@/services/set.service";
import { Button } from "@/components/ui/Button";
import { ToggleGroupSpacing } from "@/components/learn/Toggle";
import Flashcard from "@/components/learn/FlashCard";
import FlashcardControls from "@/components/learn/FlashcardControls";
import { CardList } from "@/components/learn/CardList";
import UserInfo from "@/components/user/UserInfo";
import { StudyMode, STUDY_MODES } from "@/constants/studyMode";
import { LearningProgressCard } from "@/components/learn/LearningProgress";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { useQuizAnswer } from "@/hooks/useQuizAnswer";
import { QUIZ_MODE } from "@/constants/quiz.constant";
import { StudySummaryModal } from "@/components/study/ModalCompleteQuiz";
import { isMobile, cn } from "@/lib/utils";
import type { SetItem } from "@/types/types";
import { accessService } from "@/services/access.service";

export default function SetStudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setTitle, setSetTitle] = useState("");
  const [trackProgress, setTrackProgress] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [set, setSet] = useState<SetItem | null>(null);
  const [permission, setPermission] = useState<"VIEW" | "EDIT" | "OWNER" | null>(null);

  const mode: StudyMode = useMemo(() => {
    if (!location.pathname || !id) return StudyMode.FLASHCARD;
    const found = STUDY_MODES.find((m) =>
      location.pathname.includes(m.path.replace(":id", id))
    );
    return found?.key ?? StudyMode.FLASHCARD;
  }, [location.pathname, id]);

  const { studyProgress, refresh } = useStudyProgress(id);
  const { submitAnswer, resetAnswer } = useQuizAnswer(
    QUIZ_MODE.FLASHCARD,
    () => {
      if (trackProgress) refresh();
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!set) return;
      const response = await accessService.getCurrentSetPermission(set.id);
      console.log("Current permission:", response);
      setPermission(response.permission);
    };
    fetchData();
  }, [set]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoadingCards(true);

        const set: SetItem | null = await SetService.getSetById(id);
        setSet(set);
        const cardsData = await getCardsBySet(id);

        setSetTitle(set?.title || "");
        setCards(cardsData);
        setOriginalCards(cardsData);
        setCurrentIndex(0);
        setIsPlaying(false);
      } catch (err) {
        console.error("Failed to load set", err);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchData();
  }, [id]);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const handleFlippedToBack = () => {
    if (!isPlaying) return;

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }

    autoPlayTimerRef.current = setTimeout(() => {
      nextCard();
    }, 3000);
  };

  const nextCard = () => {
    setCurrentIndex((i) => (i < cards.length - 1 ? i + 1 : i));
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
    submitAnswer({ cardId: currentCard.id, isCorrect: true });
    showOverlayAndNext("✅ Learned");
  };

  const handleMarkLearning = () => {
    submitAnswer({ cardId: currentCard.id, isCorrect: false });
    showOverlayAndNext("📖 Learning");
  };

  useEffect(() => {
    resetAnswer();
  }, [currentIndex, resetAnswer]);

  if (loadingCards) {
    return <p className="text-center mt-10 text-slate-400">Loading cards...</p>;
  }

  if (set === null) {
    return (
      <p className="text-center mt-10 text-red-500">
        Set not found or you do not have access to it.
      </p>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div
          className={cn(
            "mb-6",
            isMobile() ? "space-y-3" : "flex justify-between items-center"
          )}
        >
          <h3 className="text-2xl font-semibold">{setTitle}</h3>
          {!isMobile() && (
            permission === "OWNER" ? (
              <ToggleGroupSpacing setId={id ?? ""} />
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                <span className="font-medium">Permission:</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 border">
                  {permission}
                </span>
              </div>
            )
          )}
        </div>

        <div
          className={cn(
            "grid gap-4 mb-8",
            isMobile()
              ? "grid-cols-2"
              : "grid-cols-2 max-w-2xl mx-auto"
          )}
        >
          {STUDY_MODES.map((m) => (
            <Button
              key={m.key}
              variant="secondary"
              className={cn(
                "w-full rounded-xl transition-all cursor-pointer",
                isMobile()
                  ? "py-3 text-sm"
                  : "py-6 min-h-[56px] text-base font-semibold"
              )}
              onClick={() => id && navigate(m.path.replace(":id", id))}
            >
              {m.label}
            </Button>
          ))}
        </div>


        {mode === StudyMode.FLASHCARD && currentCard && (
          <Flashcard
            key={currentCard.id}
            card={currentCard}
            className={cn(isMobile() ? "h-[230px]" : "h-[300px]")}
            autoFlip={isPlaying}
            onFlippedToBack={() => {
              if (!isPlaying) return;
              handleFlippedToBack();
            }}
            overlayText={overlayText}
          />
        )}

        <div className={cn(isMobile() ? "mt-3" : "mt-4")}>
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
            isFullscreen={false}
            onToggleFullscreen={() =>
              navigate(`/sets/${id}/study/flashcard`)
            }
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            compact={isMobile()}
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
            onClick: () => setShowFinishModal(false),
          }}
        />
      </div>

      {studyProgress && (
        <div className="flex justify-center px-4 mt-4">
          <div
            className={cn(
              isMobile()
                ? "max-w-xs scale-95"
                : "max-w-6xl"
            )}
          >
            <LearningProgressCard {...studyProgress} />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-10">
        <UserInfo />
        <p className="font-semibold ml-2 mt-4">{setTitle}</p>
        <h2 className="mt-4 ml-2">Terminology in this module ({cards.length})</h2>
        <CardList cards={cards} />
      </div>
    </div>
  );
}
