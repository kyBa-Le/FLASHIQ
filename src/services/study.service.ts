import apiClient from "./apiClient";
import type {
  QuizMode,
  QuizResponse,
  SaveRecordPayload,
} from "@/types/quiz.type";

export const StudyService = {
  async getQuizCard(setId: string, mode: QuizMode): Promise<QuizResponse> {
    const res = await apiClient.get<QuizResponse>(
      `/api/v1/sets/${setId}/quiz`,
      {
        params: { mode },
      }
    );
    return res.data;
  },
  async getStudyProgress(setId: string) {
    const res = await apiClient.get(`/api/v1/sets/${setId}/study-records`);
    return res.data;
  },

  async updateStudyRecordScore(payload: SaveRecordPayload) {
    return await apiClient.put("/api/v1/study-records", payload);
  },
};
