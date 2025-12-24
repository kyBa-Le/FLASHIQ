import type { Login } from "@/types/auth.type";
import { createContext } from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

export type AuthContextType = {
  user: User | null;
  login: (credentials: Login) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
