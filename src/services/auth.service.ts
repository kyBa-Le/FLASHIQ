import axios from "axios";
import apiClient from "./apiClient";
import type { SignupDto } from "@/types/auth.type";
import type { LoginDto } from "@/types/auth.type";

export function register(payload: SignupDto) {
  const body = { ...payload, ...(payload.username ? { name: payload.username } : {}) };
  return apiClient.post("/api/v1/auth/register", body);
}

export async function login(payload: LoginDto) {
  const res = await apiClient.post("/api/v1/auth/login", payload);
  return res.data;
}

export async function refreshToken() {
  const res = await apiClient.post("/api/v1/auth/refresh");
  return res.data;
}

export function logout() {
  return apiClient.post("/api/v1/auth/logout");
} 

export const verifyEmail = (token: string) => {
  return axios.get("api/v1/auth/verify-email", {
    params: { token },
  });
};

export const resendVerification = (email: string) => {
  return apiClient.post("/api/v1/auth/resend-verification", { email });
};