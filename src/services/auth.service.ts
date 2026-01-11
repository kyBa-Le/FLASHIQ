import axios from "axios";
import apiClient from "./apiClient";
import type { SignupDto } from "@/types/auth.type";
import type { LoginDto } from "@/types/auth.type";
import { AUTH_API, ENV, STORAGE_KEYS } from "@/constants";

export function register(payload: SignupDto) {
  const body = {
    ...payload,
    ...(payload.username ? { name: payload.username } : {}),
  };
  return apiClient.post(AUTH_API.REGISTER, body);
}

export async function login(payload: LoginDto) {
  const res = await apiClient.post(AUTH_API.LOGIN, payload);
  return res.data;
}

export async function refreshToken() {
  const res = await refreshClient.post(AUTH_API.REFRESH, { refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) });
  const newAccessToken = res.data.data.accessToken;
  console.log(newAccessToken)

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
  return newAccessToken;
}

export async function logout() {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    await apiClient.post(AUTH_API.LOGOUT, { refreshToken: refreshToken });
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.clear();
    window.location.href = "/login";
  }
}

export const verifyEmail = (token: string) => {
  return axios.get(AUTH_API.VERIFY_EMAIL, {
    params: { token },
  });
};

export const resendVerification = (email: string) => {
  return apiClient.post(AUTH_API.RESEND_VERIFICATION, { email });
};

export const googleLogin = (token: string) => {
  return apiClient.post(AUTH_API.GOOGLE_LOGIN, { token })
}

const refreshClient = axios.create({
  baseURL: ENV.API_BASE,
  withCredentials: true,
})