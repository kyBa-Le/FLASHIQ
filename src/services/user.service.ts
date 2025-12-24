import { API_BASE } from "./apiClient";

export async function getCurrentUser(): Promise<{
  id: number;
  username: string;
  email: string;
  avatar: string;
} | null> {
  const res = await fetch(`${API_BASE}/api/v1/user/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get current user: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}
