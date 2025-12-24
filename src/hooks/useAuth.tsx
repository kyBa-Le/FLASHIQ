import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth.service";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export function useLogout() {
  const navigate = useNavigate();
  return async () => {
    await logout();
    navigate("/login");
  };
}