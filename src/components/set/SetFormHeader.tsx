import { ArrowLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/common/ConfirmModal";
import { ActionTooltip } from "../common/ActionTooltip";

type Props = {
  isPublic: boolean;
  mode: "create" | "edit" | "view";
  submitLabel: string;
  isSubmitting?: boolean;
  onTogglePublic: () => void;
  onOpenPublicModal: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
};

export function SetFormHeader({
  isPublic,
  mode,
  submitLabel,
  onTogglePublic,
  onOpenPublicModal,
  onBack,
  onEdit,
  onDelete,
  onSubmit,
  isSubmitting,
}: Props) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 cursor-pointer mb-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </div>

      {isViewMode ? (
        <div className="flex justify-end items-center gap-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="rounded-full">
              Edit
            </Button>
          )}
          {onDelete && (
            <ConfirmModal
              title="Confirm delete this set?"
              action={onDelete}
              successTitle="Deleted"
              successDescription="Set has been deleted."
            >
              <ActionTooltip label="Delete Set">
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-full text-white"
                >
                  Delete
                </Button>
              </ActionTooltip>
            </ConfirmModal>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span
              className="px-4 py-1 rounded-full bg-purple-600 text-sm text-white cursor-pointer"
              onClick={onOpenPublicModal}
            >
              Public
            </span>
            <ActionTooltip
              label={
                isPublic
                  ? "Public (Everyone can see)"
                  : "Private (Only you can see)"
              } side="bottom"
            >
              <ToggleRight
                className={cn(
                  "h-5 w-5 cursor-pointer",
                  isPublic ? "text-primary" : "text-muted-foreground"
                )}
                onClick={onTogglePublic}
              />
            </ActionTooltip>
          </div>
          {(isEditMode || isCreateMode) && onSubmit && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="rounded-full"
            >
              {submitLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
