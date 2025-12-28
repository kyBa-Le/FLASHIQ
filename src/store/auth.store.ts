import { create } from "zustand";
import { getCurrentUser } from "@/services/user.service";

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
    if (hasFetched) return; 

    set({ loading: true });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false, hasFetched: true });
      console.log("user:", user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ loading: false });
    }
  },

  logout: () => {
    set({ user: null, hasFetched: false }); 
  },
}));
