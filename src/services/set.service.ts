import apiClient from "@/services/apiClient";
import type {
  BulkAddCardsResponse,
  CardItem,
  CreateSetDto,
  SetItem,
} from "@/types/types";

export const SetService = {
  async createSet(payload: CreateSetDto): Promise<SetItem> {
    const res = await apiClient.post("/api/v1/sets", payload);
    console.log(res.data);
    return res.data;
  },

  async bulkAddCards(
    setId: string,
    cards: Array<{ term: string; definition: string; example?: string }>
  ): Promise<BulkAddCardsResponse> {
    const res = await apiClient.post<BulkAddCardsResponse>(
      `/api/v1/sets/${setId}/card/bulk`,
      {
        data: cards,
      }
    );
    console.log(res.data);
    return res.data;
  },

  async getMySets(userId: string, page = 1, limit = 10) {
    const res = await apiClient.get(`/api/v1/users/${userId}/sets`, {
      params: { page, limit },
    });

    return {
      sets: res.data.data,
      pagination: res.data.pagination,
    };
  },

  async getSetById(id: string, includeCards = false): Promise<SetItem> {
    const res = await apiClient.get(`/api/v1/sets/${id}`, {
      params: { includeCards },
    });
    return res.data.data;
  },
  async getSetCards(setId: string) {
    const res = await apiClient.get<{
      data: CardItem[];
    }>(`/api/v1/sets/${setId}/cards`);

    return res.data;
  },

  async updateSet(
    id: string,
    payload: Partial<CreateSetDto>
  ): Promise<SetItem> {
    const res = await apiClient.put(`/api/v1/sets/${id}`, payload);
    return res.data;
  },

  async deleteSet(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/sets/${id}`);
  },
};
