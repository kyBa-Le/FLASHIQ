import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type { SetFormValues } from "@/schema/flashCard.schema";
import ConfirmModal from "../common/ConfirmModal";
import { InputSet } from "../common/InputSet";
import { CardImageField } from "../common/CardImageField";
import { ActionTooltip } from "../common/ActionTooltip";

type Props = {
  index: number;
  disabled?: boolean;
  onRemove?: () => void;
};

export function SetForm({ index, disabled = false, onRemove }: Props) {
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
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_120px] gap-4">
        <div className="col-span-2 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Term (English)</Label>
              <InputSet
                disabled={disabled}
                {...register(`cards.${index}.term`)}
              />
              {cardErrors?.term && (
                <p className="text-sm text-red-500">
                  {cardErrors.term.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Definition (Vietnamese)</Label>
              <InputSet
                disabled={disabled}
                {...register(`cards.${index}.definition`)}
                className="border bg-white rounded-md px-3 py-2 text-sm w-full"
              />
              {cardErrors?.definition && (
                <p className="text-sm text-red-500">
                  {cardErrors.definition.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Example</Label>
            <Textarea
              disabled={disabled}
              {...register(`cards.${index}.example`)}
            />
            {cardErrors?.example && (
              <p className="text-sm text-red-500">
                {cardErrors.example.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between items-center h-full">
          <div className="flex items-center gap-3">
            <GripVertical className="cursor-move text-gray-400" />

            {!disabled && onRemove && (
              <ConfirmModal
                title="Confirm Delete Card"
                description="This action cannot be undone."
                action={onRemove}
                successTitle="Deleted"
                successDescription="Card removed."
                onClose={() => {}}
              >
                <ActionTooltip label="Delete card" side="bottom">
                  <Trash2 className="cursor-pointer text-muted-foreground hover:text-destructive" />
                </ActionTooltip>
              </ConfirmModal>
            )}
          </div>

          <Controller<SetFormValues, `cards.${number}.image_url`>
            name={`cards.${index}.image_url`}
            render={({ field }) => (
              <CardImageField field={field} disabled={disabled} />
            )}
          />
        </div>
      </div>
    </Card>
  );
}
