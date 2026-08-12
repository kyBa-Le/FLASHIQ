import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Loading...",
  className = "min-h-screen",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full gap-3 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <span className="text-sm font-medium text-slate-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
