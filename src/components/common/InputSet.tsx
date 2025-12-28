import * as React from "react";
import { cn } from "@/lib/utils";

export type InputSetProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputSet = React.forwardRef<HTMLInputElement, InputSetProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "border bg-white rounded-md px-3 py-2 text-sm w-full",
          className
        )}
        {...props}
      />
    );
  }
);

InputSet.displayName = "InputSet";
