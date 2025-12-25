import { AuthContext } from "./auth.context";
import { useCallback, useEffect, useState } from "react";
import type { LoginDto } from "@/types/auth.type";
import {
  login as loginService,
  logout as logoutService,
  refreshToken as refreshTokenService,
} from "@/services/auth.service";
import apiClient from "@/services/apiClient";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await refreshTokenService();

        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = useCallback(async (payload: LoginDto): Promise<void> => {
    setLoading(true);
    try {
      await loginService(payload);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutService();
    } finally {
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
