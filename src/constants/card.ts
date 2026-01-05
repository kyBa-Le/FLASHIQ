export type FlashcardControlsProps = {
  currentIndex: number;
  total: number;
  trackProgress: boolean;
  onToggleTrackProgress: () => void;
  onPrev: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
};

