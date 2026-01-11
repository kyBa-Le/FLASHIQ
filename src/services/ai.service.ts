import apiClient from "./apiClient";
import type{ AiStoryPayload } from "@/types/ai.type";
export const AiService = {
  async generateStory(setId: string, payload: AiStoryPayload) {
    const res = await apiClient.post(`/api/v1/sets/${setId}/generate-story`, payload)
    return res.data;
  }
}
