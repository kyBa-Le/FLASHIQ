import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const StudySummaryModal = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3">🎉 Completed!</h2>

        <p className="text-gray-700">
          You have completed all questions in this quiz.
        </p>

        <div className="flex justify-center mt-6">
          <Button onClick={onClose} className="rounded-full px-6">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
