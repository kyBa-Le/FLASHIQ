import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import type { FlashcardControlsProps } from "@/types/flashCard.type";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Maximize,
  Check,
  X,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FlashcardControls({
  currentIndex,
  total,
  trackProgress,
  onToggleTrackProgress,
  onPrev,
  onNext,
  onMarkLearned,
  onMarkLearning,
  onShuffle,
  isFullscreen = false,
  onToggleFullscreen,
  isPlaying = false,
  onTogglePlay,
  compact = false,
}: FlashcardControlsProps & { compact?: boolean }) {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between",
        compact ? "px-3 py-2" : "px-6 py-4"
      )}
    >
      <div className={cn("flex items-center", compact ? "gap-2" : "gap-3")}>
        {!compact && (
          <span className="text-sm font-medium hidden sm:inline">
            Track progress
          </span>
        )}
        <Switch
          checked={trackProgress}
          onCheckedChange={onToggleTrackProgress}
        />
      </div>

      <div
        className={cn(
          "flex items-center",
          compact ? "gap-2" : "gap-4"
        )}
      >
        {!trackProgress ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </Button>

            <span
              className={cn(
                "text-sm font-medium text-center",
                compact ? "min-w-[48px]" : "min-w-[60px]"
              )}
            >
              {currentIndex + 1} / {total}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="icon"
              onClick={onMarkLearning}
              className={cn(
                "bg-red-400 hover:bg-red-500 text-white",
                compact && "h-8 w-8"
              )}
            >
              <X className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </Button>

            <span
              className={cn(
                "text-sm font-medium text-center",
                compact ? "min-w-[48px]" : "min-w-[60px]"
              )}
            >
              {currentIndex + 1} / {total}
            </span>

            <Button
              type="button"
              size="icon"
              onClick={onMarkLearned}
              className={cn(
                "bg-green-400 hover:bg-green-500 text-white",
                compact && "h-8 w-8"
              )}
            >
              <Check className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </Button>
          </>
        )}
      </div>

      <div className={cn("flex items-center", compact ? "gap-1" : "gap-2")}>
        {onShuffle && !compact && (
          <Button type="button" variant="ghost" size="icon" onClick={onShuffle}>
            <Shuffle className="w-4 h-4" />
          </Button>
        )}

        {!isFullscreen && onToggleFullscreen && !compact && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}

        {isFullscreen && !trackProgress && onTogglePlay && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
