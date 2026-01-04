export interface QuizDto {
  cardId: string;
  term: string;
  image_url: string;
  example?: string;
  choices: string[];
  correctAnswer: string;
}

export interface QuizResponse {
  message: string;
  data: QuizDto[];
}

export interface SaveRecordPayload {
  cardId: string;
  isCorrect: boolean;
}
