import { useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";
import type { ControllerRenderProps } from "react-hook-form";
import type { SetFormValues } from "@/schema/flashCard.schema";

type Props = {
  field: ControllerRenderProps<SetFormValues, `cards.${number}.image_url`>;
  disabled?: boolean;
};

export function CardImageField({ field, disabled }: Props) {
  const preview = useMemo(() => {
    if (!field.value) return null;
    if (typeof field.value === "string") return field.value;
    return URL.createObjectURL(field.value);
  }, [field.value]);

  useEffect(() => {
    return () => {
      if (preview && typeof field.value !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, field.value]);

  return (
    <div className="w-full flex-1 mt-3 border border-dashed rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
      {preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {!disabled && (
            <button
              type="button"
              onClick={() => field.onChange(undefined)}
              className="absolute top-2 right-2 bg-background rounded-full p-1 shadow"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </>
      ) : (
        !disabled && (
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
        )
      )}
    </div>
  );
}
