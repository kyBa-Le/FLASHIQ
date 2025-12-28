import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};

export default function SuccessModal({
  open,
  onClose,
  title = "Thành công!",
  description = "",
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
