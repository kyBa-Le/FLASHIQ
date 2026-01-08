import apiClient from "./apiClient";
import type {
  QuizMode,
  QuizResponse,
  SaveRecordPayload,
} from "@/types/quiz.type";
import { SET_API, STUDY_API } from "@/constants";

export const StudyService = {
  async getQuizCard(setId: string, mode: QuizMode): Promise<QuizResponse> {
    const res = await apiClient.get<QuizResponse>(SET_API.QUIZ(setId), {
      params: { mode },
    });
    return res.data;
  },

  async getStudyProgress(setId: string) {
    const res = await apiClient.get(SET_API.STUDY_RECORDS(setId));
    return res.data;
  },

  async updateStudyRecordScore(payload: SaveRecordPayload) {
    return apiClient.put(STUDY_API.UPDATE_RECORD, payload);
  },
};
