import { Button } from "@/components/ui/Button";

type Props = {
  onAddCard: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onCreateAndStudy?: () => void;
  showStudyButton?: boolean;
  submitLabel: string;
  isSubmitting?: boolean;
};

export function SetFormFooter({
  onAddCard,
  onCancel,
  onSubmit,
  onCreateAndStudy,
  showStudyButton = false,
  submitLabel,
  isSubmitting,
}: Props) {
  return (
    <>
      <div className="flex justify-center mb-2">
        <Button
          type="button"
          variant="outline"
          onClick={onAddCard}
          className="rounded-full"
        >
          Add Card
        </Button>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full"
        >
          Cancel
        </Button>

        {showStudyButton && onCreateAndStudy && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCreateAndStudy}
            className="rounded-full"
          >
            Create & Study
          </Button>
        )}

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="rounded-full"
        >
          {submitLabel}
        </Button>
      </div>
    </>
  );
}
