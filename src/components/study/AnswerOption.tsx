import { Check, X } from "lucide-react";

interface AnswerOptionProps {
  label: string;
  state?: "default" | "correct" | "wrong" | "selected";
  onClick: () => void;
  disabled?: boolean;
}

export const AnswerOption = ({
  label,
  state = "default",
  onClick,
  disabled,
}: AnswerOptionProps) => {
  const variants = {
    default:
      "border-slate-100 text-gray-700 hover:border-slate-300 hover:bg-slate-50",
    selected: "border-purple-500 bg-purple-50 text-purple-700",
    correct: "border-green-500 bg-green-50 text-gray-700",
    wrong: "border-red-400 bg-red-50 text-gray-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full p-2 rounded-2xl border-2 transition-all font-medium flex items-center justify-center gap-2 sm:text-lg ${variants[state]}`}
    >
      {state === "correct" && <Check className="w-5 h-5 shrink-0" />}
      {state === "wrong" && <X className="w-5 h-5 shrink-0" />} 
      {label}
    </button>
  );
};
