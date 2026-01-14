import { Bookmark, Users, Share, Ellipsis } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/Button";
import { ModalPublicSet } from "@/components/set/ModalPublicSet";
import { useState } from "react";

type Props = {
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenGroup?: () => void;
  onOpenMore?: () => void;
  setId: string;
};

export function ToggleGroupSpacing({
  isSaved = false,
  onToggleSave,
  onOpenGroup,
  onOpenMore,
  setId,
}: Props) {
  const [openShareModal, setOpenShareModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <ToggleGroup type="single" value={isSaved ? "saved" : ""}>
          <ToggleGroupItem
            value="saved"
            aria-label="Save"
            onClick={onToggleSave}
            variant="outline"
            className="bg-white gap-1 px-3 data-[state=on]:text-blue-600"
          >
            <Bookmark className="h-4 w-4" />
            Save
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenGroup}
          className="gap-1 px-3"
        >
          <Users className="h-4 w-4" />
          Group
        </Button>

        <Button
          size="icon"
          variant="outline"
          aria-label="Share"
          onClick={() => setOpenShareModal(true)}
        >
          <Share className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          aria-label="More"
          onClick={onOpenMore}
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </div>

      <ModalPublicSet
        open={openShareModal}
        onClose={setOpenShareModal}
        setId={setId}
      />
    </>
  );
}
