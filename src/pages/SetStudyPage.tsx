import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import type { Card } from "@/types/card.type";
import { getCardsBySet } from "@/services/card.service";
import { SetService } from "@/services/set.service";

import { Button } from "@/components/ui/Button";
import { ToggleGroupSpacing } from "@/components/learn/Toggle";
import Flashcard from "@/components/learn/FlashCard";
import FlashcardControls from "@/components/learn/FlashcardControls";
import { CardList } from "@/components/learn/CardList";
import LearnedList from "@/components/learn/LearnedList";
import UserInfo from "@/components/user/UserInfo";
import { StudyMode, STUDY_MODES } from "@/constants/studyMode";

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

  const mode: StudyMode = useMemo(() => {
    if (!location.pathname || !id) return StudyMode.FLASHCARD;

    const found = STUDY_MODES.find((m) =>
      location.pathname.includes(m.path.replace(":id", id))
    );

    return found?.key ?? StudyMode.FLASHCARD;
  }, [location.pathname, id]);

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
      } catch (err) {
        console.error("Failed to load set", err);
      }
    };

    fetchData();
  }, [id]);

  const handleFlippedToBack = () => {
    if (!isPlaying) return;

    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev >= cards.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setCards(originalCards);
    } else {
      shuffleCards();
    }

    setIsShuffled((p) => !p);
    setCurrentIndex(0);
  };

  if (!cards.length) {
    return <p className="text-center mt-10">No cards in this set</p>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">{setTitle}</h3>
          <ToggleGroupSpacing />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 mx-24">
          {STUDY_MODES.map((m) => (
            <Button
              key={m.key}
              variant="secondary"
              onClick={() => {
                if (id) navigate(m.path.replace(":id", id));
              }}
            >
              {m.label}
            </Button>
          ))}
        </div>

        {mode === StudyMode.FLASHCARD && (
          <Flashcard
            key={currentCard.id}
            card={currentCard}
            className="h-[300px]"
            autoFlip={isPlaying}
            onFlippedToBack={handleFlippedToBack}
          />
        )}

        <FlashcardControls
          currentIndex={currentIndex}
          total={cards.length}
          trackProgress={trackProgress}
          onToggleTrackProgress={() => {
            setTrackProgress((p) => !p);
            setIsPlaying(false);
          }}
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          onNext={() =>
            setCurrentIndex((i) => Math.min(i + 1, cards.length - 1))
          }
          onShuffle={toggleShuffle}
          isFullscreen={false}
          onToggleFullscreen={() =>
            navigate(`/sets/${id}/study/flashcard`)
          }
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <UserInfo />
        <p>{setTitle}</p>
        <h2 className="font-semibold mt-4">
          You have also learned
        </h2>
        <LearnedList />
        <h2 className="font-semibold mt-4">
          Terminology in this module ({cards.length})
        </h2>
        <CardList cards={cards} />
      </div>
    </div>
  );
}
