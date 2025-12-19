import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
