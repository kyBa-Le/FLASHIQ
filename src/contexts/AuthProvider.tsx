import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./auth.context";
import { login as loginService } from "@/services/auth.service";
import apiClient from "@/services/apiClient";
import { decodeJwt } from "@/utils/jwt";
import type { JwtPayload } from "@/utils/jwt";
import type { LoginDto } from "@/types/auth.type";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = decodeJwt<JwtPayload>(token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(decoded);
      setIsAuthenticated(true);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const res = await loginService(data);

    const { accessToken, refreshToken } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const decoded = decodeJwt<JwtPayload>(accessToken);
    setUser(decoded);
    setIsAuthenticated(true);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
