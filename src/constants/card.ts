export interface CardResponse {
  id: string;
  front: string;
  back: string;
  example?: string;
}

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

export interface DeckCardProps {
  title: string;
  progress: string;
  username: string;
  avatarUrl?: string;
}
