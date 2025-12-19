import { createContext} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
};

 export const AuthContext = createContext<AuthContextType | null>(null);
