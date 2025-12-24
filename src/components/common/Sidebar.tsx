import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Bell, Folder, Plus, Tags } from "lucide-react";

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
  const renderLink = (item: SidebarItem) => {
    const Icon = item.icon;

    if (item.to) {
      return (
        <NavLink
          key={item.id}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center p-2 rounded-lg hover:bg-secondary hover:text-white ${
              isActive ? "bg-secondary text-white" : "text-gray-500"
            }`
          }
          aria-current={undefined}
        >
          <Icon className="w-4 h-4" />
          <span className="ml-2 text-sm font-medium">{item.name}</span>
        </NavLink>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => console.log(`${item.name} clicked`)}
        className="flex items-center p-2 rounded-lg hover:bg-secondary hover:text-white text-gray-500"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            (e.target as HTMLElement).click();
          }
        }}
      >
        <Icon className="w-4 h-4" />
        <span className="ml-2 text-sm font-medium">{item.name}</span>
      </button>
    );
  };

  return (
    <aside className="w-80 p-4 bg-white border-r border-gray-200 h-full">
      <nav className="space-y-3" role="navigation" aria-label="Sidebar">
        <div className="space-y-1">{mainItems.map((it) => renderLink(it))}</div>

        <hr />

        <div className="ml-2 text-sm font-medium text-gray-500">
          Your Folder
        </div>
        <div className="space-y-1">
          {folderItems.map((it) => renderLink(it))}
        </div>

        <hr />

        <div className="ml-2 text-sm font-medium text-gray-500">
          Your Card set
        </div>
        <div className="space-y-1">{cardItems.map((it) => renderLink(it))}</div>
      </nav>
    </aside>
  );
};

export default Sidebar;
