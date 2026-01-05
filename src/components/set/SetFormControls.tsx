import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "../common/ConfirmModal";
import { useFieldArray, type Control } from "react-hook-form";
import type { SetFormValues } from "@/schema/flashCard.schema";
import { Trash2 } from "lucide-react";
import { ActionTooltip } from "../common/ActionTooltip";
import { ImportModal } from "@/components/common/ImportModal";

type Props = {
  control: Control<SetFormValues>;
  onDeleteAllCards?: () => void;
};

export function SetFormControls({ control, onDeleteAllCards }: Props) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "cards",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBulkImport = (newCards: any[]) => {
    newCards.forEach((card) => {
      append({
        term: card.term,
        definition: card.definition,
        example: card.example || "",
        image_url: card.image_url || "",
      });
    });
  };

  const handleDeleteAll = async () => {
    if (fields.length === 0) return;

    if (onDeleteAllCards) {
      await onDeleteAllCards();
    } else {
      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }
    }
  };

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        <ActionTooltip
          label="Import from Copy paste or Word, Excel"
          side="bottom"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="rounded-full border-slate-200 text-slate-500 text-xs h-8 hover:bg-slate-50"
          >
            + Import
          </Button>
        </ActionTooltip>

        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleBulkImport}
        />
      </div>

      {fields.length > 0 && (
        <ConfirmModal
          title="Confirm Delete all Cards"
          description="This action cannot be undone. All current cards in this set will be removed."
          action={handleDeleteAll}
          successTitle="Success!"
          successDescription="All cards have been deleted."
          onClose={() => {}}
        >
          <div className="p-1.5 hover:bg-red-50 rounded-full transition-colors cursor-pointer group">
            <ActionTooltip label="Delete all cards" side="bottom">
              <Trash2 className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
            </ActionTooltip>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}
