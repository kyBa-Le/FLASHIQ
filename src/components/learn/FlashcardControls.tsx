import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
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
import type { FlashcardControlsProps } from "@/constants/card";

export default function FlashcardControls({
  currentIndex,
  total,
  trackProgress,
  onToggleTrackProgress,
  onPrev,
  onNext,
  onShuffle,

  isFullscreen = false,
  onToggleFullscreen,

  isPlaying = false,
  onTogglePlay,
}: FlashcardControlsProps) {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium hidden sm:inline">
          Track progress
        </span>
        <Switch
          checked={trackProgress}
          onCheckedChange={onToggleTrackProgress}
        />
      </div>

      <div className="flex items-center gap-4">
        {!trackProgress ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium min-w-[60px] text-center">
              {currentIndex + 1} / {total}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon"
              onClick={onPrev}
              className="bg-red-400 hover:bg-red-500 text-white"
            >
              <X className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium min-w-[60px] text-center">
              {currentIndex + 1} / {total}
            </span>

            <Button
              size="icon"
              onClick={onNext}
              className="bg-green-400 hover:bg-green-500 text-white"
            >
              <Check className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onShuffle && (
          <Button variant="ghost" size="icon" onClick={onShuffle}>
            <Shuffle className="w-4 h-4" />
          </Button>
        )}

        {!isFullscreen && onToggleFullscreen && (
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        )}

        {isFullscreen && !trackProgress && onTogglePlay && (
          <Button variant="ghost" size="icon" onClick={onTogglePlay}>
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
