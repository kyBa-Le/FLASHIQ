/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { importBulkCards } from "@/utils/importBulkCards";
import type { ImportCard } from "@/utils/importBulkCards";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (cards: ImportCard[]) => void;
}

export default function ImportModal({
  isOpen,
  onClose,
  onImport,
}: ImportModalProps) {
  const [text, setText] = useState("");
  const [termDelimiter, setTermDelimiter] = useState<"tab" | "comma">("tab");
  const [cardDelimiter, setCardDelimiter] = useState<"newline" | "semicolon">(
    "newline"
  );

  const parsedCards = useMemo(() => {
    return importBulkCards(text, cardDelimiter, termDelimiter).map((c) => ({
      term: c.term,
      definition: c.definition,
      example: c.example ?? "",
      image_url: "",
    }));
  }, [text, cardDelimiter, termDelimiter]);

  const handleImport = () => {
    if (parsedCards.length === 0) return;
    onImport(parsedCards);
    setText("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <div className="space-y-2">
          <p>
            <span className="font-bold">Enter data:</span> Copy and paste data
            here (from Word, Excel, Google Docs, etc.)
          </p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`From 1\tDefinition 1\tExample 1
From 2\tDefinition 2\tExample 2
From 3\tDefinition 3\tExample 3`}
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-sm mb-2">
              Between terminology & definition
            </p>
            <RadioGroup
              value={termDelimiter}
              onValueChange={(v) => setTermDelimiter(v as any)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="tab" id="tab" />
                <Label htmlFor="tab">Tab</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="comma" id="comma" />
                <Label htmlFor="comma">Comma</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2">Between the cards</p>
            <RadioGroup
              value={cardDelimiter}
              onValueChange={(v) => setCardDelimiter(v as any)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="newline" id="newline" />
                <Label htmlFor="newline">New line</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="semicolon" id="semicolon" />
                <Label htmlFor="semicolon">Semicolon</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">
            Preview: <span className="text-primary">{parsedCards.length}</span>{" "}
            cards
          </p>

          {parsedCards.length === 0 && text.trim() && (
            <p className="text-xs text-red-500 italic">
              No content available for preview.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedCards.length === 0}
            className="rounded-full"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
