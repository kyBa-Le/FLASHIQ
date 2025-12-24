// src/components/set/SetForm.tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GripVertical, ImagePlus, Trash2, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type { SetFormValues } from "@/schema/flashCard.schema";

type Props = {
  index: number;
  onRemove: () => void;
};

export function SetForm({ index, onRemove }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetFormValues>();

  const cardErrors = errors.cards?.[index];

  return (
    <Card
      className={`rounded-xl p-4 space-y-4 ${
        cardErrors ? "border-red-400" : ""
      }`}
    >
      <div className="grid grid-cols-[1fr_1fr_120px] gap-4">
        <div className="col-span-2 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Term (English)</Label>
              <Input {...register(`cards.${index}.term`)} className="border bg-white rounded-md px-3 py-2 text-sm w-full" />
              {cardErrors?.term && (
                <p className="text-sm text-red-500">
                  {cardErrors.term.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Definition (Vietnamese)</Label>
              <Input {...register(`cards.${index}.definition`)} className="border bg-white rounded-md px-3 py-2 text-sm w-full" />
              {cardErrors?.definition && (
                <p className="text-sm text-red-500">
                  {cardErrors.definition.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Example</Label>
            <Textarea {...register(`cards.${index}.example`)} />
            {cardErrors?.example && (
              <p className="text-sm text-red-500">
                {cardErrors.example.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between items-center h-full">
          <div className="flex justify-between items-center gap-3">
            <GripVertical className="cursor-move text-gray-400" />
            <Trash2
              className="cursor-pointer text-muted-foreground hover:text-destructive h-5 w-5"
              onClick={onRemove}
            />
          </div>
          <Controller
            name={`cards.${index}.image`}
            render={({ field }) => {
              const preview =
                field.value instanceof File
                  ? URL.createObjectURL(field.value)
                  : field.value;

              return (
                <div className="w-full flex-1 mt-3 border border-dashed rounded-xl flex flex-col items-center justify-center text-sm text-muted-foreground relative overflow-hidden">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => field.onChange(undefined)}
                        className="absolute top-2 right-2 bg-background rounded-full p-1 shadow"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5 mb-1" />
                      <span>Upload image</span>

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }}
                      />
                    </>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>
    </Card>
  );
}
