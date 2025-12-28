import apiClient from "./apiClient";

export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
  email: string;
  avatar: string;
} | null> {
  const res = await apiClient.get("/api/v1/users/me");

  return res.data.data;
};
