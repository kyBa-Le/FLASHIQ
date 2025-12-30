import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Bell, Folder, Plus, Tags } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: number;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to?: string;
  action?: "button";
};

const mainItems: SidebarItem[] = [
  { id: 1, icon: Home, name: "Home", to: "/" },
  { id: 2, icon: Folder, name: "My Library", to: "/library" },
  { id: 3, icon: Bell, name: "Notifications", to: "/notifications" },
];

const folderItems: SidebarItem[] = [
  { id: 4, icon: Folder, name: "Folder #1", to: "*" },
  { id: 5, icon: Folder, name: "Folder #2", to: "*" },
  { id: 6, icon: Plus, name: "New Folder", to: "*" },
];

const cardItems: SidebarItem[] = [
  { id: 7, icon: Tags, name: "View all", to: "*" },
  { id: 8, icon: Plus, name: "New set", to: "/sets/create" },
];
const Sidebar: React.FC = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  const renderLink = (item: SidebarItem) => {
    const Icon = item.icon;

    const commonClass = ({ isActive }: { isActive?: boolean } = {}) =>
      cn(
        "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-secondary hover:text-white",
        isActive ? "bg-secondary text-white" : "text-gray-500",
        isCollapsed ? "justify-center" : "justify-start"
      );

    const linkContent = (
      <>
        <Icon className="w-4 h-4 shrink-0" />
        {!isCollapsed && (
          <span className="ml-2 text-sm font-medium whitespace-nowrap">
            {item.name}
          </span>
        )}
      </>
    );

    if (item.to) {
      return (
        <NavLink key={item.id} to={item.to} className={commonClass}>
          {linkContent}
        </NavLink>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => console.log(`${item.name} clicked`)}
        className={cn(commonClass(), "w-full")}
      >
        {linkContent}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        "p-4 bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-20" : "w-70"
      )}
    >
      <nav className="space-y-3" role="navigation" aria-label="Sidebar">
        <div className="space-y-1">{mainItems.map((it) => renderLink(it))}</div>

        <hr className="border-gray-100" />

        {!isCollapsed && (
          <div className="ml-2 text-sm font-medium text-gray-500">
            Your Folder
          </div>
        )}
        <div className="space-y-1">
          {folderItems.map((it) => renderLink(it))}
        </div>

        <hr className="border-gray-100" />

        {!isCollapsed && (
          <div className="ml-2 text-sm font-medium text-gray-500">
            Your Card set
          </div>
        )}
        <div className="space-y-1">{cardItems.map((it) => renderLink(it))}</div>
      </nav>
    </aside>
  );
};

export default Sidebar;
