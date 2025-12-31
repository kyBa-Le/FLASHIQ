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

//   const backTimerRef = useRef<NodeJS.Timeout | null>(null);
const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


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

  const handleFlippedToBack = () => {
    if (!isPlaying) return;

    if (backTimerRef.current) {
      clearTimeout(backTimerRef.current);
    }

    backTimerRef.current = setTimeout(() => {
      setCurrentIndex((i) => {
        if (i >= cards.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 3000);
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setCards(originalCards);
    } else {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying && backTimerRef.current) {
      clearTimeout(backTimerRef.current);
    }
    setIsPlaying((p) => !p);
  };

  if (!currentCard) {
    return (
      <p className="mt-10 text-center text-gray-500">
        No cards in this set
      </p>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none p-4">
        <QuizHeader title="Memory Card" onClose={() => navigate(-1)} />

        <div className="mt-2 text-center">
          <h1 className="text-sm font-semibold text-gray-700">
            {setTitle}
          </h1>
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
          onPrev={() =>
            setCurrentIndex((i) => Math.max(i - 1, 0))
          }
          onNext={() =>
            setCurrentIndex((i) =>
              Math.min(i + 1, cards.length - 1)
            )
          }
          onShuffle={toggleShuffle}
          isFullscreen
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </div>
    </div>
  );
}
