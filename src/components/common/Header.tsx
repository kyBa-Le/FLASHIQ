import React from "react";
import { Menu, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

const LOGO_SRC = "/assets/logo.png";
const ADD_ICON_SRC = "/assets/add.png";
const ICON_SIZE = 18;

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 mt-2">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <Menu size={25} />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="h-12 w-12 rounded-full overflow-hidden bg-white flex items-center justify-center"
                aria-hidden="true"
              >
                <img
                  src={LOGO_SRC}
                  alt="FLASHIQ logo"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 mx-6 max-w-lg">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Search size={ICON_SIZE} />
              </span>
              <input
                aria-label="Search"
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/create-set"
              aria-label="create-set"
              className="h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <img src={ADD_ICON_SRC} alt="create-set" /> 
            </NavLink>
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium"
                role="button"
                aria-label="User menu"
              >
                <span className="sr-only">User menu</span>
                <span aria-hidden="true">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
