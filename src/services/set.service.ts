/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import type {
  BulkAddCardsResponse,
  CardItem,
  CreateSetDto,
  SetItem,
} from "@/types/types";
import { SET_API, USER_API } from "@/constants";

export const SetService = {
  async createSet(payload: CreateSetDto): Promise<SetItem> {
    const res = await apiClient.post(SET_API.BASE, payload);
    return res.data;
  },

  async bulkAddCards(
    setId: string,
    cards: Array<{ term: string; definition: string; example?: string }>
  ): Promise<BulkAddCardsResponse> {
    const res = await apiClient.post<BulkAddCardsResponse>(
      SET_API.BULK_CARDS(setId),
      { data: cards }
    );
    return res.data;
  },

  async getMySets(userId: string, page = 1, limit = 10) {
    const res = await apiClient.get(USER_API.SETS_BY_USER(userId), {
      params: { page, limit },
    });

    return {
      sets: res.data.data,
      pagination: res.data.pagination,
    };
  },

  async getSetById(id: string, includeCards = false): Promise<SetItem> {
    const res = await apiClient.get(SET_API.DETAIL(id), {
      params: { includeCards },
    });
    return res.data.data;
  },

  async getSetCards(setId: string) {
    const res = await apiClient.get<{ data: CardItem[] }>(SET_API.CARDS(setId));
    return res.data;
  },

  async updateSet(
    id: string,
    payload: Partial<CreateSetDto>
  ): Promise<SetItem> {
    const res = await apiClient.put(SET_API.DETAIL(id), payload);
    return res.data;
  },

  async deleteSet(id: string): Promise<void> {
    await apiClient.delete(SET_API.DETAIL(id));
  },

  async searchSets(
    query: string,
    signal?: AbortSignal
  ): Promise<{ data: any }> {
    const res = await apiClient.get(SET_API.SEARCH, {
      params: { q: query, page: 1, limit: 100 },
      signal,
    });
    return res.data;
  },
};
