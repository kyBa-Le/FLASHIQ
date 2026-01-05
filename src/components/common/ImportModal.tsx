/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (cards: any[]) => void;
}

export const ImportModal = ({
  isOpen,
  onClose,
  onImport,
}: ImportModalProps) => {
  const [text, setText] = useState("");
  const [termDelimiter, setTermDelimiter] = useState("\\t");
  const [cardDelimiter, setCardDelimiter] = useState("\\n");

  const parsedCards = useMemo(() => {
    if (!text.trim()) return [];

    const actualCardDelim = cardDelimiter === "\\n" ? "\n" : cardDelimiter;
    const actualTermDelim = termDelimiter === "\\t" ? "\t" : termDelimiter;

    return text
      .split(actualCardDelim)
      .map((line) => {
        const parts = line.split(actualTermDelim);
        if (parts.length >= 2) {
          return {
            term: parts[0].trim(),
            definition: parts[1].trim(),
            example: "",
            image_url: "",
          };
        }
        return null;
      })
      .filter((card) => card !== null);
  }, [text, termDelimiter, cardDelimiter]);

  const handleSubmit = () => {
    onImport(parsedCards);
    setText("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-slate-400">
            Import
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">
              Enter data:{" "}
              <span className="font-normal text-slate-500">
                Copy and paste data here (from Word, Excel, Google Docs, etc.)
              </span>
            </Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Word 1    Definition 1&#10;Word 2    Definition 2"
              className="min-h-[220px] bg-white border-2 border-slate-200 focus:border-primary rounded-xl transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DelimiterGroup
              label="Between terminology and definitions"
              value={termDelimiter}
              onChange={setTermDelimiter}
              options={[
                { label: "Tab", value: "\\t" },
                { label: "Comma", value: "," },
              ]}
            />
            <DelimiterGroup
              label="Between the cards"
              value={cardDelimiter}
              onChange={setCardDelimiter}
              options={[
                { label: "New line", value: "\\n" },
                { label: "Semicolon", value: ";" },
              ]}
            />
          </div>

          <div className="py-2">
            <p className="text-sm font-bold text-slate-800">
              Preview <span className="text-primary">{parsedCards.length}</span>{" "}
              cards
            </p>
            {parsedCards.length === 0 && text.trim() && (
              <p className="text-xs text-red-500 mt-1 italic">
                No content available for preview. Check your delimiters.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={onClose}
              className="rounded-full px-8 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={parsedCards.length === 0}
              className="rounded-full px-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-lg disabled:opacity-50"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DelimiterGroup = ({ label, value, onChange, options }: any) => (
  <div className="space-y-3">
    <p className="font-bold text-[13px] text-slate-800">{label}</p>
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
      {options.map((opt: any) => (
        <div
          key={opt.value}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <RadioGroupItem
            value={opt.value}
            id={opt.value}
            className="border-slate-300 text-primary"
          />
          <Label
            htmlFor={opt.value}
            className="text-sm font-medium text-slate-600 group-hover:text-primary cursor-pointer"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);
