// src/layouts/EditorLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";

export default function EditorLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-hidden bg-background">
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
