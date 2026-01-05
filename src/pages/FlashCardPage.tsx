/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlashCard from "@/components/learn/FlashCard";
import FlashcardControls from "@/components/learn/FlashcardControls";
import { getCardsBySet } from "@/services/card.service";
import { SetService } from "@/services/set.service";
import { QuizHeader } from "@/components/common/QuizHeader";
import type { Card } from "@/types/card.type";

export default function FlashCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setTitle, setSetTitle] = useState("");
  const [trackProgress, setTrackProgress] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [overlayText, setOverlayText] = useState<string | null>(null);

  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const set = await SetService.getSetById(id);
        const cardsData = await getCardsBySet(id);

        setSetTitle(set.title);
        setCards(cardsData);
        setOriginalCards(cardsData);
        setCurrentIndex(0);
        setIsPlaying(false);
        setIsShuffled(false);
      } catch (err) {
        console.error("Failed to load set", err);
      }
    };

    fetchData();
  }, [id]);

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((i) => (i < cards.length - 1 ? i + 1 : i));
  };

  const handleFlippedToBack = () => {
    if (!isPlaying) return;

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }

    autoPlayTimerRef.current = setTimeout(() => {
      nextCard();
    }, 3000);
  };

  const showOverlayAndNext = (text: string) => {
    setOverlayText(text);
    setIsPlaying(false);

    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }

    overlayTimerRef.current = setTimeout(() => {
      setOverlayText(null);
      nextCard();
    }, 600);
  };

  const handleMarkLearned = () => {
    showOverlayAndNext("✅ Learned");
  };

  const handleMarkLearning = () => {
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

  const togglePlay = () => {
    if (isPlaying && autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    setIsPlaying((p) => !p);
  };

  if (!currentCard) {
    return (
      <p className="mt-10 text-center text-gray-500">No cards in this set</p>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none p-4">
        <QuizHeader title="Memory Card" onClose={() => navigate(-1)} />

        <div className="mt-2 text-center">
          <h1 className="text-sm font-semibold text-gray-700">{setTitle}</h1>
          <p className="text-xs text-gray-500">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 mb-6 mx-24">
        <FlashCard
          key={currentCard.id}
          card={currentCard}
          className="h-full"
          autoFlip={isPlaying}
          onFlippedToBack={handleFlippedToBack}
          overlayText={overlayText}
        />
      </div>

      <div className="flex-none bg-white px-4 py-3 mb-6 mx-24">
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
          isFullscreen
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </div>
    </div>
  );
}
