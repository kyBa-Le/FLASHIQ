import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import {LogOutIcon, User } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { NavLink } from "react-router-dom";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-2 focus:ring-primary rounded-full transition-all hover:opacity-80">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs">
              {user.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-50 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="truncate leading-4 text-sm font-semibold leading-none">
              {user.username}
            </p>
            <p className="truncate text-xs leading-4 text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2">
          <NavLink
            to="/profile"
            className="flex w-full items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="p-0 focus:bg-transparent"
        >
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <ConfirmModal
              title="Confirm logout this source?"
              description="Are you sure you want to logout? This action cannot be undone."
              action={logout}
              onClose={() => {}}
            >
              <div className="flex items-center w-full px-2 py-2 text-sm text-red-600 cursor-pointer">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span className="font-medium">Logout</span>
              </div>
            </ConfirmModal>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
