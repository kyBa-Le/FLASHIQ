import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./auth.context";
import { googleLogin, login as loginService } from "@/services/auth.service";
import apiClient from "@/services/apiClient";
import type { LoginDto } from "@/types/auth.type";
import { getCurrentUser } from "@/services/user.service";
import type { User } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token) {
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const user = await getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const res = await loginService(data);

    const { accessToken, refreshToken } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    const user = await getCurrentUser();
    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const response = await googleLogin(credential);
    const { accessToken, refreshToken } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    const user = await getCurrentUser();
    setUser(user);
    setIsAuthenticated(true);
  }, []);


  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}
