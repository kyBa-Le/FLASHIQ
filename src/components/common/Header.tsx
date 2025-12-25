import React from "react";
import { Menu, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Input } from "../ui/input";

const LOGO_SRC = "/assets/logo.png";
const ADD_ICON_SRC = "/assets/add.png";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b bg-white      ">
      <div className="mx-auto w-full max-w-[100vw] px-[2vw]">
        <div className="flex h-[8vh] min-h-[56px] max-h-[64px] items-center justify-between">
          <div className="flex items-center gap-[1.2vw] shrink-0">
            <button className="flex h-[5vh] w-[5vh] min-h-[40px] min-w-[40px] items-center justify-center rounded-md hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </button>

            <NavLink
              to="/"
              className="block h-[5vh] w-[5vh] min-h-[40px] min-w-[40px]"
            >
              <img
                src={LOGO_SRC}
                className="h-full w-full rounded-full object-cover"
              />
            </NavLink>
          </div>

          <div className="flex-1 mx-[2vw] min-w-0">
            <div className="relative mx-auto max-w-[40vw]">
              <Search className="absolute left-[1vw] top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input type="search" className="w-full pl-[3vw] rounded-md" placeholder="Search..." />
            </div>
          </div>

          <div className="flex items-center gap-[1.2vw] shrink-0">
            <NavLink
              to="/sets/create"
              className="block h-[5vh] w-[5vh] min-h-[40px] min-w-[40px]"
            >
              <img
                src={ADD_ICON_SRC}
                className="h-full w-full rounded-full object-cover"
              />
            </NavLink>
            <div className="h-[4vh] w-[4vh] min-h-[36px] min-w-[36px] rounded-full bg-gray-200 flex items-center justify-center">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
