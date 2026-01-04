/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Settings,
  X as CloseIcon,
  ChevronDown,
  Layers,
  CheckSquare,
  LayoutGrid,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuizMode =
  | "Multiple Choice"
  | "True/False"
  | "Memory Card"
  | "Fill in Blank";

const iconMapping: Record<QuizMode, { label: string; icon: any }> = {
  "Multiple Choice": { label: "tag", icon: CheckSquare },
  "True/False": { label: "tag2", icon: Layers },
  "Memory Card": { label: "tag3", icon: Copy },
  "Fill in Blank": { label: "tag4", icon: LayoutGrid },
};

export const QuizHeader = ({
  title,
  onClose,
  onSettingsClick,
}: {
  title: QuizMode;
  onClose?: () => void;
  onSettingsClick?: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center sticky top-0 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black rotate-12 group-hover:rotate-0 transition-transform">
            {iconMapping[title]?.label || "QZ"}
          </div>
          <div className="flex items-center">
            <span className="font-bold text-xs">Mutiple Choice</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-54 p-2 rounded-2xl border-slate-100"
        >
          <DropdownMenuLabel className="text-[10px] font-black text-slate-400 tracking-widest">
            Mode Study
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigate("/quiz/memory")}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer "
          >
            <span>FlashCard</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
            <span>Mutiple Choice</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
            <span>Fill in blank</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
            <span>True/False</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2 bg-slate-100" />

          <DropdownMenuItem
            onClick={() => navigate("/")}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-slate-600"
          >
            <span>Home</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/search")}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-slate-600"
          >
            <span>Search</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2">
        <button
          onClick={onSettingsClick}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
