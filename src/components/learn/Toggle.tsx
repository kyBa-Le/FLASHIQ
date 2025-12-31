import { Bookmark, Users, Share, Ellipsis } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/Button";

export function ToggleGroupSpacing() {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="multiple"
        variant="outline"
        className="flex gap-2 bg-white"
      >
        <ToggleGroupItem
          value="saved"
          aria-label="Toggle saved"
          className=" bg-white
            gap-1 px-3
            data-[state=on]:bg-transparent
            data-[state=on]:[&>svg]:fill-blue-500
            data-[state=on]:[&>svg]:stroke-blue-500
          "
        >
          <Bookmark className="h-4 w-4" />
          Save
        </ToggleGroupItem>

        <ToggleGroupItem
          value="group"
          aria-label="Toggle group"
          className="gap-1 px-3"
        >
          <Users className="h-4 w-4" />
          Group
        </ToggleGroupItem>
      </ToggleGroup>

      <Button size="icon" variant="outline" aria-label="Share">
        <Share className="h-4 w-4" />
      </Button>

      <Button size="icon" variant="outline" aria-label="More">
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>
  );
}
