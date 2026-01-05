export interface Card {
  id: string;
  term: string;
  definition: string;
  example?: string;
  image_url?: string;
  setId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardResponse {
  id: string;
  front: string;
  back: string;
  example?: string;
}

export interface DeckCardProps {
  title: string;
  progress: string;
  username: string;
  avatarUrl?: string;
}