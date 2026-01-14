/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";
import { NotificationService } from "@/services/notification.service";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/notification.store";

const MainLayout: React.FC = () => {
  const { fetchUser, hasFetched, loading, user } = useAuthStore();
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const navigate = useNavigate();

  const { setNotifications, fetchInitialNotifications } = useNotificationStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !hasFetched && !loading) {
      fetchUser();
    }
  }, [fetchUser, hasFetched, loading]);

  useEffect(() => {
    if (user?.id) {
      fetchInitialNotifications();
    }
  }, [user?.id, fetchInitialNotifications]);

  useEffect(() => {
    if (!user?.id) return;

    NotificationService.registerFCM();
    const unsubscribe = NotificationService.listenForegroundMessages(
      (payload) => {
        const newNoti = {
          id: payload.messageId || Date.now().toString(),
          userId: user.id,
          type: payload.data?.type || "SYSTEM",
          title: payload.notification?.title || "New Notification",
          message: payload.notification?.body || "",
          isRead: false,
          createdAt: new Date().toISOString(),
          data: payload.data,
        };

        setNotifications((prev: any) => [newNoti, ...prev]);

        toast.success(newNoti.title, {
          description: newNoti.message,
          action: {
            label: "View",
            onClick: () => navigate("/notifications"),
          },
        });
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, setNotifications, navigate]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div
            className={cn(
              "mx-auto p-4 md:p-8 transition-all duration-300 ease-in-out",
              isCollapsed ? "max-w-7xl" : "max-w-6xl"
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
