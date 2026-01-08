import { createContext } from "react";
import type { LoginDto } from "@/types/auth.type";
import type { User } from "@/store/auth.store";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>(
  {} as AuthContextValue
);