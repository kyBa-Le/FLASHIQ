import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface StudySummaryModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const StudySummaryModal = ({
  open,
  onClose,
  title = "🎉 Completed!",
  description = "You’ve finished this study session.",
  primaryAction,
  secondaryAction,
}: StudySummaryModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>

        <p className="text-gray-600">{description}</p>

        <div className="flex justify-center gap-3 mt-6">
          {secondaryAction && (
            <Button
              variant="secondary"
              className="rounded-full px-6"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              className="rounded-full px-6"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
