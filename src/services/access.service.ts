import apiClient from "./apiClient";

export type Permission = "EDIT" | "VIEW";

export type AccessUser = {
  id: string;
  permission: Permission;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
};

export type InviteAccessPayload = {
  setId: string;
  email: string;
  permission: Permission;
};

export const accessService = {
  getSetAccess(setId: string) {
    if (!setId) {
      return Promise.resolve({ data: [] });
    }
    return apiClient.get(`/api/v1/access/set/${setId}`);
  },

  inviteUser(payload: InviteAccessPayload) {
    return apiClient.post("/api/v1/access", payload);
  },

  removeAccess(accessId: string) {
    return apiClient.delete(`/api/v1/access/${accessId}`);
  },

  async getCurrentSetPermission(setId: string) {
    const response = await apiClient.get(`api/v1/access/set/${setId}/permission`)
    return response.data.data
  }
};
