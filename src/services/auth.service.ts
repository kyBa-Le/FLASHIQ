import apiClient from "./apiClient";
import type { SignupDto } from "@/types/auth.type";
import type { LoginDto } from "@/types/auth.type";

export function register(payload: SignupDto) {
  const body = { ...payload, ...(payload.username ? { name: payload.username } : {}) };
  return apiClient.post("/api/v1/auth/register", body);
}

export function login(payload: LoginDto) {
  return apiClient.post("/api/v1/auth/login", payload);
}

export async function refreshToken() {
  const res = await apiClient.post("/api/v1/auth/refresh");
  return res.data;
}

export function logout() {
  return apiClient.post("/api/v1/auth/logout");
} 
