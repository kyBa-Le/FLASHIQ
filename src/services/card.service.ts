import apiClient from "./apiClient";
import type { CardDto, CardItem, CardWithIdDto } from "@/types/types";
import { SET_API, CARD_API } from "@/constants";

export const CardService = {
  async addCard(setId: string, payload: CardDto) {
    const res = await apiClient.post(SET_API.CARDS(setId), payload);
    return res.data as CardItem;
  },

  async bulkImport(setId: string, payload: CardDto[]) {
    const res = await apiClient.post(SET_API.BULK_CARDS(setId), payload);
    return res.data as CardItem[];
  },

  async getCard(cardId: string) {
    const res = await apiClient.get(CARD_API.DETAIL(cardId));
    return res.data as CardItem;
  },

  async updateCard(cardId: string, payload: CardDto) {
    const res = await apiClient.put(CARD_API.DETAIL(cardId), payload);
    return res.data as CardItem;
  },

  async deleteCard(cardId: string) {
    const res = await apiClient.delete(CARD_API.DETAIL(cardId));
    return res.data as { success: boolean; message?: string };
  },

  async bulkUpdateCards(payload: {
    setId: string;
    oldCards: CardWithIdDto[];
    newCards: CardDto[];
  }) {
    await apiClient.put(CARD_API.BULK_UPDATE, payload);
  },

  async getCardById(cardId: string) {
    return apiClient.get(CARD_API.DETAIL(cardId));
  },
};
export const getCardsBySet = async (setId: string) => {
  const res = await apiClient.get(SET_API.CARDS(setId));
  return res.data.data;
};
