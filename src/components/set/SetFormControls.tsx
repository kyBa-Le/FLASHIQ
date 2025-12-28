import { Button } from "@/components/ui/Button";
import ConfirmModal from "../common/ConfirmModal";
import { useFieldArray, type Control } from "react-hook-form";
import type { SetFormValues } from "@/schema/flashCard.schema";
import { Trash2 } from "lucide-react";
import { ActionTooltip } from "../common/ActionTooltip";

type Props = {
  control: Control<SetFormValues>;
  onImport?: () => void;
  onDeleteAllCards?: () => void;
};

export function SetFormControls({
  control,
  onImport,
  onDeleteAllCards,
}: Props) {
  const { fields, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const handleDeleteAll = async () => {
    if (fields.length === 0) {
      alert("No cards to delete.");
      return;
    }

    if (onDeleteAllCards) {
      await onDeleteAllCards();
    } else {
      for (let i = fields.length - 1; i >= 0; i--) remove(i);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <ActionTooltip label="Import from Copy paste or Word, Excel " side="bottom">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onImport}
          className="rounded-full px-4"
        >
          + Import
        </Button>
      </ActionTooltip>
      {fields.length > 0 && (
        <ConfirmModal
          title="Confirm Delete all Cards"
          description="This action cannot be undone."
          action={handleDeleteAll}
          successTitle="Success!"
          successDescription="All cards have been deleted."
        >
          <ActionTooltip label="Delete all cards" side="bottom">
            <Trash2 className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-destructive" />
          </ActionTooltip>
        </ConfirmModal>
      )}
    </div>
  );
}
