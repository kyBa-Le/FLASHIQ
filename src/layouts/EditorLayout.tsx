// src/layouts/EditorLayout.tsx
import { Outlet } from "react-router-dom";
import  Header from "@/components/common/Header";

export default function EditorLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
