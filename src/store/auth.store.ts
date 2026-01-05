import { create } from "zustand";
import { getCurrentUser } from "@/services/user.service";
import { logout as apiLogout } from "@/services/auth.service";

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  hasFetched: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  hasFetched: false,

  fetchUser: async () => {
    const { hasFetched } = get();
    const token = localStorage.getItem("accessToken");

    if (hasFetched || !token) {
      if (!token && !hasFetched) {
        set({ user: null, hasFetched: true, loading: false });
      }
      return;
    }

    set({ loading: true });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false, hasFetched: true });
      console.log("user:", user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ user: null, loading: false, hasFetched: true });
    }
  },

  logout: () => {
    apiLogout();
    set({ user: null, hasFetched: false, loading: false });
  },
}));
