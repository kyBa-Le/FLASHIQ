import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import SuccessModal from "./SuccessModal";

type ConfirmModalProps = {
  title: string; 
  description?: string;
  action: () => void | Promise<void>;
  successTitle?: string;
  successDescription?: string;
  errorMessage?: string; 
  children: React.ReactNode;
};

export default function ConfirmModal({
  title,
  description,
  action,
  successTitle = "Success!",
  successDescription = "",
  errorMessage = "Action failed!",
  children,
}: ConfirmModalProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await Promise.resolve(action()); 
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setConfirmOpen(true)} className="inline-block">
        {children}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Loading..." : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={successTitle}
        description={successDescription}
      />
    </>
  );
}
