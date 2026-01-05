import type { Card as CardType } from "@/types/card.type";
import { Card } from "../ui/card";
import { Star, Volume2 } from "lucide-react";
import { useState } from "react";

interface Props {
  cards: CardType[];
}

export function CardList({ cards }: Props) {
  if (!cards || cards.length === 0) {
    return (
      <div className="py-6 px-4 text-sm text-muted-foreground">
        No cards available
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-gray-50 px-4 py-6">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

function CardItem({ card }: { card: CardType }) {
  const [starred, setStarred] = useState(false);

  return (
    <Card className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center gap-4 rounded-xl border bg-white px-4 py-3">
      <p className="text-base font-medium truncate">{card.term}</p>

      <div className="flex flex-col gap-1">
        <p className="text-base font-medium truncate">{card.definition}</p>
        {card.example && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            eg: {card.example}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {card.image_url && (
          <img
            src={card.image_url}
            alt={card.term}
            className="w-10 h-10 object-contain"
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Star
          onClick={() => setStarred(!starred)}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            starred
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
        <Volume2 className="w-5 h-5 cursor-pointer" />
      </div>
    </Card>
  );
}
