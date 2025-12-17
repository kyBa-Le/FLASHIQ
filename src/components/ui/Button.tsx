type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition duration-200";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}
