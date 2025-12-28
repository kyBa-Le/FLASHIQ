import { createContext } from "react";
import type { JwtPayload } from "@/utils/jwt";
import type { LoginDto } from "@/types/auth.type";

export interface AuthContextValue {
  user: JwtPayload | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>(
  {} as AuthContextValue
);