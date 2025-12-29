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
    const value = field.value as unknown;

    if (!value) return null;

    if (typeof value === "string") return value;

    if (value instanceof File || value instanceof Blob) {
      return URL.createObjectURL(value);
    }

    return null;
  }, [field.value]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full flex-1 mt-3 border border-dashed rounded-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[100px] bg-muted/30">
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
              onClick={() => field.onChange("")}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </>
      ) : (
        !disabled && (
          <div className="flex flex-col items-center cursor-pointer">
            <ImagePlus className="h-5 w-5 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload</span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) field.onChange(file);
              }}
            />
          </div>
        )
      )}
    </div>
  );
}
