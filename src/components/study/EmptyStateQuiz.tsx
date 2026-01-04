import { Button } from "../ui/Button";

export default function NotEnoughCardsState({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Not enough cards to start learning
      </h2>

      <p className="text-red-500 text-slate-500 mb-6">
        You need at least <b>4 cards</b> to use Multiple Choice mode.
      </p>

      <Button onClick={onBack} variant="outline">
        Back to set
      </Button>
    </div>
  );
}
