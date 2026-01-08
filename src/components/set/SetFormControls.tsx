/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import ImportModal from "@/components/common/ImportModal";
import type { ImportCard } from "@/utils/importBulkCards";
import type { SetFormValues } from "@/schema/flashCard.schema";

type Props = {
  control: Control<SetFormValues>;
  onImportCards: (cards: SetFormValues["cards"]) => void;
  onDeleteAllCards: () => void | Promise<void>;
};

export function SetFormControls({
  control,
  onImportCards,
  onDeleteAllCards,
}: Props) {
  const [openImportModal, setOpenImportModal] = useState(false);

  const { fields } = useFieldArray({
    control,
    name: "cards",
  });

  const handleImport = (parsed: ImportCard[]) => {
    const cards: SetFormValues["cards"] = parsed.map((card) => ({
      term: card.term,
      definition: card.definition,
      example: card.example || "",
      image_url: "",
    }));

    onImportCards(cards);
    setOpenImportModal(false);
  };

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenImportModal(true)}
          className="rounded-full"
        >
          <Plus />
          Import
        </Button>

        <ImportModal
          isOpen={openImportModal}
          onClose={() => setOpenImportModal(false)}
          onImport={handleImport}
        />
      </div>

      {fields.length > 0 && (
        <ConfirmModal
          title="Delete all cards?"
          description="This action cannot be undone."
          action={onDeleteAllCards}
          successTitle="Deleted"
          successDescription="All cards have been removed."
        >
          <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
        </ConfirmModal>
      )}
    </div>
  );
}
