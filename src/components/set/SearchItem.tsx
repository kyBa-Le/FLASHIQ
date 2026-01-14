import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface SearchItemProps {
  item: {
    id: string;
    title: string;
    viewCount: number;
    description?: string;
    username?: string;
    avatarUrl?: string;
  };
}

export default function SearchItem({ item }: SearchItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sets/${item.id}/study`);
  };

  return (
    <Card
      onClick={handleClick}
      className="
        border border-slate-200 shadow-none hover:shadow-md transition-shadow
        cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col h-full
      "
    >
      <CardContent className="p-4 sm:p-5 flex-1 space-y-2 sm:space-y-4">
        <h3 className="text-sm sm:text-[17px] font-bold text-slate-900 leading-tight line-clamp-2">
          {item.title}
        </h3>

        <p className="text-xs sm:text-[15px] font-medium text-slate-500 leading-tight line-clamp-2">
          {item.description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="hidden md:flex px-5 pb-5 pt-0 items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-slate-100">
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
              {item.avatarUrl}
            </AvatarFallback>
          </Avatar>

          <span className="text-[11px] font-medium text-slate-400">
            {item.username || "Anonymous"}
          </span>
        </div>

        <button className="text-[12px] font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
          Preview
        </button>
      </CardFooter>
    </Card>
  );
}
