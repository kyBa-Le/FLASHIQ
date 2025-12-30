import apiClient from "./apiClient";
import type { CardItem } from "@/types/types";

export const CardService = {
   async addCard(setId: string, payload: { term: string; definition: string; example?: string }) {
    const res = await apiClient.post(`/api/v1/sets/${setId}/cards`, payload);
    return res.data as CardItem;
  },

   async bulkImport(setId: string, payload: { term: string; definition: string; example?: string }[]) {
    const res = await apiClient.post(`/api/v1/sets/${setId}/card/bulk`, payload);
    return res.data as CardItem[];
  },

   async getCard(cardId: string) {
    const res = await apiClient.get(`/api/v1/cards/${cardId}`);
    return res.data as CardItem;
  },

   async updateCard(cardId: string, payload: { term?: string; definition?: string; example?: string;image_url?:string }) {
    const res = await apiClient.put(`/api/v1/cards/${cardId}`, payload);
    return res.data as CardItem;
  },

   async deleteCard(cardId: string) {
    const res = await apiClient.delete(`/api/v1/cards/${cardId}`);
    return res.data as { success: boolean; message?: string };
  }
}
