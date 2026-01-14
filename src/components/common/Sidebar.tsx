import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, Folder, Plus, Tags, BookOpenText } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification.store";

type SidebarItem = {
  id: number;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to?: string;
  action?: "button";
};
  
const mainItems: SidebarItem[] = [
  { id: 2, icon: Folder, name: "My Library", to: "/library" },
  { id: 3, icon: Bell, name: "Notifications", to: "/notifications" },
  {
    id: 4,
    icon: BookOpenText,
    name: "Story Generation",
    to: "/story-generation",
  },
];

const folderItems: SidebarItem[] = [
  { id: 4, icon: Folder, name: "Folder #1", to: "*" },
  { id: 5, icon: Folder, name: "Folder #2", to: "*" },
  { id: 6, icon: Plus, name: "New Folder", to: "*" },
];

const cardItems: SidebarItem[] = [
  { id: 7, icon: Tags, name: "Shared sets", to: "/shared" },
  { id: 8, icon: Plus, name: "New set", to: "/sets/create" },
];
const Sidebar: React.FC = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const notifications = useNotificationStore((state) => state.notifications);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const renderLink = (item: SidebarItem) => {
    const Icon = item.icon;
    const isNotification = item.name === "Notifications";

    const commonClass = ({ isActive }: { isActive?: boolean } = {}) =>
      cn(
        "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-secondary hover:text-white",
        isActive ? "bg-secondary text-white" : "text-gray-500",
        isCollapsed ? "justify-center" : "justify-start"
      );

    const linkContent = (
      <>
        <div className="relative flex items-center justify-center">
          <Icon className="w-5 h-5 shrink-0" />

          {isNotification && unreadCount > 0 && isCollapsed && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="ml-3 flex items-center justify-between w-full overflow-hidden">
            <span className="text-sm font-medium truncate">{item.name}</span>

            {isNotification && unreadCount > 0 && (
              <span className="me-20 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
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
