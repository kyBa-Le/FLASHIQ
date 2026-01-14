import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, Folder, Plus, Tags, BookOpenText } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn, isMobile } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification.store";

type SidebarItem = {
  id: number;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to?: string;
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


const cardItems: SidebarItem[] = [
  { id: 7, icon: Tags, name: "Shared sets", to: "/shared" },
  { id: 8, icon: Plus, name: "New set", to: "/sets/create" },
];

const Sidebar: React.FC = () => {
  const { isCollapsed, close } = useSidebarStore();

  const handleItemClick = () => {
    if (isMobile()) {
      close();
    }
  };
  const notifications = useNotificationStore((state) => state.notifications);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const renderLink = (item: SidebarItem) => {
    const Icon = item.icon;
    const isNotification = item.name === "Notifications";

    const className = ({ isActive }: { isActive?: boolean }) =>
      cn(
        "flex items-center p-2 rounded-lg transition-all duration-200",
        "hover:bg-secondary hover:text-white",
        isActive ? "bg-secondary text-white" : "text-gray-500",
        isCollapsed ? "justify-center" : "justify-start"
      );

    return (
      <NavLink
        key={item.id}
        to={item.to ?? "#"}
        className={className}
        onClick={handleItemClick}
      >
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
      </NavLink>
    );
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out p-4",

          /* MOBILE */
          "hidden",
          !isCollapsed &&
          "fixed inset-y-0 left-0 z-50 block w-70 h-screen",

          /* DESKTOP */
          "md:block md:static md:h-full md:shrink-0",
          isCollapsed ? "md:w-20" : "md:w-70"
        )}
      >
        <nav className="space-y-3" role="navigation">
          <div className="space-y-1">
            {mainItems.map(renderLink)}
          </div>
          <hr className="border-gray-100" />

          {!isCollapsed && (
            <div className="ml-2 text-sm font-medium text-gray-500">
              Your Card set
            </div>
          )}
          <div className="space-y-1">
            {cardItems.map(renderLink)}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
