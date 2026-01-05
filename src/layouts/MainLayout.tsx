import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";

const MainLayout: React.FC = () => {
  const { fetchUser, hasFetched, loading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !hasFetched && !loading) {
      fetchUser();
    }
  }, [fetchUser, hasFetched, loading]);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "h-full border-r bg-white transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          <Sidebar />
        </aside>

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
