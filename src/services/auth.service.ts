import { API_BASE } from "./apiClient";
export async function login(username: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important: send/receive cookies
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  // expected shape: { user: string }
  return data.user;
}
