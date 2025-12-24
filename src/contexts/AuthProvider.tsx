// AuthProvider.tsx
import Cookies from "js-cookie";
import { AuthContext } from "./auth.context";
import { useCallback, useEffect, useState } from "react";
import type { Login } from "@/types/auth.type";
import {
  login as loginService,
  logout as logoutService,
} from "@/services/auth.service";
import { getCurrentUser } from "@/services/user.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (payload: Login) => {
      setLoading(true);
      try {
        await loginService(payload);
        await fetchUser();
      } finally {
        setLoading(false);
      }
    },
    [fetchUser]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutService();
    } finally {
      Cookies.remove("access_token");
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
