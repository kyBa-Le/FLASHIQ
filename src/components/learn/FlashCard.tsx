import { useEffect, useState } from "react";
import type { Card } from "@/types/card.type";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  card: Card;
  className?: string;
  autoFlip?: boolean;
  onFlippedToBack?: () => void;
}

export default function FlashCard({
  card,
  className,
  autoFlip = false,
  onFlippedToBack,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  useEffect(() => {
    if (!autoFlip) return;

    const timer = setTimeout(() => {
      setFlipped(true);
      onFlippedToBack?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [autoFlip, card.id, onFlippedToBack]);

  return (
    <div
      className={cn(
        "relative w-full perspective cursor-pointer",
        className
      )}
      onClick={() => setFlipped((p) => !p)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          flipped && "rotate-x-180"
        )}
      >
        <div className="absolute inset-0 rounded-2xl border bg-white shadow-sm flex items-center justify-center backface-hidden">
          <span className="text-3xl font-medium text-center">
            {card.term}
          </span>
        </div>

        <div className="absolute inset-0 rounded-2xl border bg-white shadow-sm backface-hidden rotate-x-180 px-8">
          <div className="grid grid-cols-2 gap-6 h-full items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-medium">
                {card.definition}
              </span>

              {card.example && (
                <span className="mt-4 text-sm italic text-gray-500">
                  eg: {card.example}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center">
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.term}
                  className="max-h-40 rounded-lg object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">No image</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
