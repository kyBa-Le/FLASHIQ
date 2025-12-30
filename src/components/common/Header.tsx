import React from "react";
import { Menu, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ActionTooltip } from "./ActionTooltip";
import UserDropdown from "./UserDropdown";
import { useSidebarStore } from "@/store/sidebar.store";
import { InputSet } from "./InputSet";

const LOGO_SRC = "/assets/logo.png";
const ADD_ICON_SRC = "/assets/add.png";

const Header: React.FC = () => {
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto w-full max-w-[100vw] px-[2vw]">
        <div className="flex h-[8vh] min-h-[56px] max-h-[64px] items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggle}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            <NavLink to="/" className="block h-10 w-10 shrink-0">
              <ActionTooltip label="Back to home page">
                <img
                  src={LOGO_SRC}
                  alt="Logo"
                  className="h-full w-full rounded-full object-cover shadow-sm"
                />
              </ActionTooltip>
            </NavLink>
          </div>

          <div className="flex-1 max-w-2xl min-w-0 hidden sm:block">
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <InputSet
                type="search"
                className="w-full pl-10 focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NavLink to="/sets/create" className="block h-10 w-10">
              <ActionTooltip label="Create new Set">
                <img
                  src={ADD_ICON_SRC}
                  alt="Add"
                  className="h-full w-full rounded-full object-cover hover:scale-105 transition-transform"
                />
              </ActionTooltip>
            </NavLink>

            <div className="h-9 w-9 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
