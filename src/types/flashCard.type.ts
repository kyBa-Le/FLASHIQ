export interface FlashcardControlsProps {
  currentIndex: number;
  total: number;
  trackProgress: boolean;
  onToggleTrackProgress: () => void;

  onPrev: () => void;
  onNext: () => void;

  onMarkLearned: () => void;
  onMarkLearning: () => void;

  onShuffle?: () => void;

  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;

  isPlaying?: boolean;
  onTogglePlay?: () => void;
}