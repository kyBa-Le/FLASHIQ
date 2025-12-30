export interface CreateSetDto {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface CardDto {
  term: string;
  definition: string;
  example?: string;
  image_url?: string;
}
export interface SetItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  isPublic?: boolean;
  viewCount?: number;
  cloneCount?: number;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BulkAddCardsResponse {
  message: string;
  data: {
    count: number;
  };
}

export interface PaginatedSets {
  sets: SetItem[];
  total: number;
}

export interface CardItem {
  id: string;
  term: string;
  definition: string;
  example?: string;
  image_url?: string;
  setId: string;
  createdAt: string;
  updatedAt: string;
}
export interface SetDetail {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  cards: CardItem[];
}
