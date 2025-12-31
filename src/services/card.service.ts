import apiClient from "./apiClient";
import type { CardDto, CardItem, CardWithIdDto } from "@/types/types";

export const CardService = {
  async addCard(setId: string, payload: CardDto) {
    const res = await apiClient.post(`/api/v1/sets/${setId}/cards`, payload);
    return res.data as CardItem;
  },

  async bulkImport(setId: string, payload: CardDto[]) {
    const res = await apiClient.post(
      `/api/v1/sets/${setId}/card/bulk`,
      payload
    );
    return res.data as CardItem[];
  },

  async getCard(cardId: string) {
    const res = await apiClient.get(`/api/v1/cards/${cardId}`);
    return res.data as CardItem;
  },

  async updateCard(cardId: string, payload: CardDto) {
    const res = await apiClient.put(`/api/v1/cards/${cardId}`, payload);
    return res.data as CardItem;
  },

  async deleteCard(cardId: string) {
    const res = await apiClient.delete(`/api/v1/cards/${cardId}`);
    return res.data as { success: boolean; message?: string };
  },

  async bulkUpdateCards(payload: {setId: string, oldCards: CardWithIdDto[], newCards: CardDto[]}) {
    await apiClient.put(`/api/v1/cards/bulk`, payload)
  }
};

export const getCardsBySet = async (setId: string) => {
  const res = await apiClient.get(`/api/v1/sets/${setId}/cards`);
  return res.data.data;
};
