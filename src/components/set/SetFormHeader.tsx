import { ArrowLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/common/ConfirmModal";
import { ActionTooltip } from "../common/ActionTooltip";
import { useEffect, useState } from "react";
import { accessService } from "@/services/access.service";

type Permission = "OWNER" | "EDIT" | "VIEW" | "";

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
  setId: string;
};

export function SetFormHeader({
  isPublic,
  mode,
  submitLabel,
  onTogglePublic,
  onBack,
  onEdit,
  onDelete,
  onSubmit,
  isSubmitting,
  setId,
}: Props) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const [permission, setPermission] = useState<Permission>("");

  const isOwner = permission === "OWNER";
  const isEditor = permission === "EDIT";

  useEffect(() => {
    if (isCreateMode) return;
    if (!setId) return;

    const fetchPermission = async () => {
      try {
        const res = await accessService.getCurrentSetPermission(setId);
        setPermission(res.permission);
      } catch (error) {
        console.error("Failed to fetch permission", error);
      }
    };

    fetchPermission();
  }, [setId, isCreateMode]);

  const BackButton = (
    <div
      className="flex items-center gap-2 cursor-pointer mb-2"
      onClick={onBack}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </div>
  );

  if (isCreateMode) {
    return (
      <div className="flex flex-col gap-2">
        {BackButton}

        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 rounded-full bg-purple-600 text-sm text-white">
              Public
            </span>

            <ActionTooltip
              label={
                isPublic
                  ? "Public (Everyone can see)"
                  : "Private (Only you can see)"
              }
              side="bottom"
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

          {onSubmit && (
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {BackButton}

      {isViewMode && (
        <div className="flex justify-end items-center gap-2">
          {isOwner && (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="rounded-full"
                >
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-full text-white"
                  >
                    Delete
                  </Button>
                </ConfirmModal>
              )}
            </>
          )}

          {isEditor && onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              className="rounded-full"
            >
              Edit
            </Button>
          )}
        </div>
      )}

      {isEditMode && isOwner && (
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 rounded-full bg-purple-600 text-sm text-white">
              Public
            </span>

            <ActionTooltip
              label={
                isPublic
                  ? "Public (Everyone can see)"
                  : "Private (Only you can see)"
              }
              side="bottom"
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

          {onSubmit && (
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
