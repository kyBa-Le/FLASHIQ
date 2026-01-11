import { USER_API } from "@/constants";
import apiClient from "./apiClient";

export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
  email: string;
  avatar: string;
} | null> {
  const res = await apiClient.get(USER_API.ME);

  return res.data.data;
};
