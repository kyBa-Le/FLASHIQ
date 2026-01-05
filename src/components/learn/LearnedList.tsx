import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LearnedCard from "./LearnedCard";
import { getCardsBySet } from "@/services/card.service";

interface Card {
  id: string;
  setId: string;
}

interface LearnedSet {
  setId: string;
  reviewed: number;
  total: number;
}

export default function LearnedList() {
  const [sets, setSets] = useState<LearnedSet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearnedCards = async () => {
      try {
        const setId = "1";

        const cards: Card[] = await getCardsBySet(setId);

        const grouped = cards.reduce<Record<string, LearnedSet>>(
          (acc, card) => {
            if (!acc[card.setId]) {
              acc[card.setId] = {
                setId: card.setId,
                reviewed: 0,
                total: 0,
              };
            }

            acc[card.setId].total += 1;
            acc[card.setId].reviewed += 1;

            return acc;
          },
          {}
        );

        setSets(Object.values(grouped));
      } catch (error) {
        console.error("Failed to load learned cards", error);
      }
    };

    fetchLearnedCards();
  }, []);

  if (!sets.length) {
    return (
      <p className="text-sm text-gray-500">
        You haven’t learned any cards yet
      </p>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {sets.map((set) => (
        <LearnedCard
          key={set.setId}
          reviewed={set.reviewed}
          total={set.total}
          onContinue={() =>
            navigate(`/sets/${set.setId}/study/flashcard`)
          }
        />
      ))}
    </div>
  );
}
