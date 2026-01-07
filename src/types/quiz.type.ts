import { QUIZ_MODE } from "@/constants/quiz.constant";

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

export type QuizMode =
  typeof QUIZ_MODE[keyof typeof QUIZ_MODE];

export interface QuizResponse {
  cardId: string;
  term: string;
  correctAnswer: string;
  mode: QuizMode;
}