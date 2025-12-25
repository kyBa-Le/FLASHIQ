import { createContext } from "react";
import type { LoginDto } from "@/types/auth.type";

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  logout: async () => {},
});
