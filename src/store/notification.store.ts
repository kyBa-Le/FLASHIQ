/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Notification } from "@/types/notification.type";
import { NotificationService } from "@/services/notification.service";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  fetchInitialNotifications: () => Promise<void>;
  setNotifications: (
    input: Notification[] | ((prev: Notification[]) => Notification[])
  ) => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      loading: false,

      fetchInitialNotifications: async () => {
        if (get().loading) return;

        set({ loading: true });
        try {
          const response = await NotificationService.fetchAllNotifications();
          set({ notifications: Array.isArray(response) ? response : [] });
        } catch (error) {
          console.error("Fetch noti error", error);
        } finally {
          set({ loading: false });
        }
      },

      setNotifications: (input) =>
        set((state) => {
          const nextData =
            typeof input === "function" ? input(state.notifications) : input;
          return { notifications: nextData };
        }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
