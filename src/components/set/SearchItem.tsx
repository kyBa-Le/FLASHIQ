import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SearchItemProps {
  item: {
    id: string;
    title: string;
    viewCount: number;
    description?: string;
  };
}

export default function SearchItem({ item }: SearchItemProps) {
  return (
    <Card className="border border-slate-200 shadow-none hover:shadow-md transition-shadow cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col h-full">
      <CardContent className="p-5 flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Learn key concepts & definitions
          </span>
        </div>

        <h3 className="text-[17px] font-bold text-slate-900 leading-tight line-clamp-2 min-h-[42px]">
          {item.title}
        </h3>

        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md text-[11px]">
          {item.viewCount || 0} views
        </Badge>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-slate-100">
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-none">User</span>
            <span className="text-[11px] font-medium text-slate-400 mt-1">Student</span>
          </div>
        </div>
        <button className="text-[12px] font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
          Preview
        </button>
      </CardFooter>
    </Card>
  );
}