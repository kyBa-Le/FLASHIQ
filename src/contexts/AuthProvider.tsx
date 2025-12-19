// AuthProvider.tsx
import Cookies from "js-cookie";
import { AuthContext } from "./auth.context";
import { useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = Cookies.get("access_token");

  const [isAuthenticated] = useState<boolean>(() => Boolean(token));
  const [loading] = useState(false);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
