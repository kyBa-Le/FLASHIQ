export const ProgressStep = ({
  score,
  total,
}: {
  score: number;
  total: number;
}) => {
  const segments = 4;
  const scorePerSegment = total / segments;

  const displayScore = Math.max(0, Math.min(score, total));
  const totalPercentage = (displayScore / total) * 100;

  return (
    <div className="w-full pt-4 pb-4 px-4 sticky top-0 z-50">
      <div className="relative flex items-center w-full gap-2">
        {[...Array(segments)].map((_, i) => (
          <div
            key={i}
            className="relative flex-1 h-5 bg-[#F0CDFF] rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-secondary transition-all duration-500 ease-out"
              style={{
                width:
                  displayScore >= (i + 1) * scorePerSegment
                    ? "100%"
                    : displayScore > i * scorePerSegment
                    ? `${
                        ((displayScore - i * scorePerSegment) /
                          scorePerSegment) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>
        ))}

        <div
          className="absolute top-1/2 z-20 transition-all duration-500 ease-out pointer-events-none"
          style={{
            left: `${totalPercentage}%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-secondary rounded-full">
            <span className="text-white font-black text-lg sm:text-xl leading-none">
              {score ?? 0}
            </span>
          </div>
        </div>

        <div className="absolute top-1/2 -right-1 translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full font-black transition-colors ${
              score >= total
                ? "bg-secondary text-white"
                : "bg-[#F0CDFF] text-white"
            }`}
          >
            <span className="text-sm sm:text-base">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
