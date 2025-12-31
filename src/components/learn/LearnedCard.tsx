import UserInfo from "../user/UserInfo";

interface LearnedCardProps {
  title?: string;
  reviewed: number;
  total: number;
  onContinue?: () => void;
}

export default function LearnedCard({
  title,
  reviewed,
  total,
  onContinue,
}: LearnedCardProps) {
  return (
    <div className="min-w-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title || "Recently Learned Flashcards"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {reviewed}/{total} cards reviewed
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <UserInfo />

        <button
          onClick={onContinue}
          className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
        >
          Continue in Flashcards
        </button>
      </div>
    </div>
  );
}
