import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { ListItemContent } from "@/components/card-content/ListItemContent"; 
import ConfirmModal from "@/components/common/ConfirmModal"; 
import { SetService } from "@/services/set.service";

interface LibraryItemProps {
  item: {
    id: string;
    title: string;
    card_count: number;
    username: string;
  };
  onDeleteSuccess?: (id: string) => void;
}

const LibraryItem: React.FC<LibraryItemProps> = ({ item, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const handleAction = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  const handleConfirmDelete = async () => {
    try {
      await SetService.deleteSet(item.id);
      if (onDeleteSuccess) {
        onDeleteSuccess(item.id);
      }
    } catch (error) {
      console.error("Lỗi API xóa:", error);
    }
  };

  return (
    <li className="list-none">
      <Card
        variant="flashcard"
        className="group relative hover:bg-muted/50 transition cursor-pointer p-5"
        onClick={() => navigate(`/sets/${item.id}/study`)}
      >
        <div className="absolute top-2 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-gray-200 rounded-full transition-opacity "
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 shadow-lg">
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={(e) => handleAction(e, `/sets/${item.id}/view`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={(e) => handleAction(e, `/sets/${item.id}/edit`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Set</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="p-0 focus:bg-red-50"
              >
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                  <ConfirmModal
                    title="Confirm delete set?"
                    description="Are you sure you want to delete this set? This action cannot be undone."
                    action={handleConfirmDelete}
                    onClose={() => {}}
                  >
                    <div className="flex items-center w-full px-2 py-2 text-sm text-red-600 cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span className="font-medium">Delete Set</span>
                    </div>
                  </ConfirmModal>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="pr-10 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <ListItemContent
              title={item.title}
              meta={`${item.card_count} term | created by ${item.username}`}
            />
          </div>
        </div>
      </Card>
    </li>
  );
};

export default LibraryItem;
