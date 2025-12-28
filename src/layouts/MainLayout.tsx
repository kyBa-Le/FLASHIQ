import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const MainLayout: React.FC = () => {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 border-r bg-white">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
