import { API_BASE } from "./apiClient";

type ApiResponse<T = unknown> = {
  message?: string;
  data?: T;
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data: ApiResponse<T> | string = isJson
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data?.message ?? "Something went wrong";

    throw new Error(message);
  }

  return typeof data === "string" ? (data as T) : data.data ?? (data as T);
}

export function register(payload: {
  username?: string;
  email: string;
  password: string;
}) {
  return request(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function refreshToken() {
  return request(`${API_BASE}/api/v1/auth/refresh`, {
    method: "POST",
  });
}

export function logout() {
  return request(`${API_BASE}/api/v1/auth/logout`, {
    method: "POST",
  });
}
