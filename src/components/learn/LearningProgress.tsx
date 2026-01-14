import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Book, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { ActionTooltip } from "@/components/common/ActionTooltip";
import { isMobile, cn } from "@/lib/utils";

interface LearningProgressProps {
  mastered: number;
  learning: number;
  newOrForgot: number;
  total: number;
}

export const LearningProgressCard = ({
  mastered,
  learning,
  newOrForgot,
  total,
}: LearningProgressProps) => {
  const masteredPercent = total ? (mastered / total) * 100 : 0;
  const learningPercent = total ? (learning / total) * 100 : 0;
  const newForgotPercent = total ? (newOrForgot / total) * 100 : 0;

  const COLORS = {
    mastered: "#6F42C1",
    learning: "#9B6CE6",
    newForgot: "#D4B3F5",
  };

  const mainStatus = useMemo(() => {
    if (newOrForgot >= learning && newOrForgot >= mastered) {
      return { label: "new / forgot", percent: newForgotPercent };
    }
    if (learning >= mastered) {
      return { label: "learning", percent: learningPercent };
    }
    return { label: "mastered", percent: masteredPercent };
  }, [
    masteredPercent,
    learningPercent,
    newForgotPercent,
    newOrForgot,
    learning,
    mastered,
  ]);

  const cardsInfo = [
    {
      label: "Mastered",
      value: mastered,
      description: "cards fully memorized",
      icon: <CheckCircle size={20} />,
      color: COLORS.mastered,
      iconColor: "white",
      percent: masteredPercent,
    },
    {
      label: "Learning",
      value: learning,
      description: "cards still practicing",
      icon: <Book size={20} />,
      color: COLORS.learning,
      iconColor: "white",
      percent: learningPercent,
    },
    {
      label: "New/Forgot",
      value: newOrForgot,
      description: "cards new or forgotten",
      icon: <AlertCircle size={20} />,
      color: COLORS.newForgot,
      iconColor: COLORS.mastered,
      percent: newForgotPercent,
    },
  ];

  return (
    <Card className="w-full mb-4 border">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">
          Learning progress
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className={cn(
            "flex items-center gap-10 mt-3",
            isMobile() ? "flex-col" : "flex-row"
          )}
        >
          <div
            className={cn(
              "relative shrink-0",
              isMobile() ? "w-28 h-28" : "w-36 h-36"
            )}
          >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />

              {cardsInfo.map(
                (item, idx) =>
                  item.percent > 0 && (
                    <ActionTooltip
                      key={item.label}
                      label={`${item.label}: ${Math.round(item.percent)}%`}
                    >
                      <circle
                        className="transition-all duration-300 cursor-help hover:stroke-[4.5]"
                        stroke={item.color}
                        strokeWidth="3.5"
                        strokeDasharray={`${item.percent} ${100 - item.percent
                          }`}
                        strokeDashoffset={`-${cardsInfo
                          .slice(0, idx)
                          .reduce((sum, prev) => sum + prev.percent, 0)}`}
                        fill="none"
                        cx="18"
                        cy="18"
                        r="16"
                      />
                    </ActionTooltip>
                  )
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">
                {Math.round(mainStatus.percent)}%
              </span>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                {mainStatus.label}
              </span>
            </div>
          </div>

          <div
            className={cn(
              isMobile()
                ? "flex gap-3 overflow-x-auto w-full pb-2"
                : "grid grid-cols-3 gap-4 w-full"
            )}
          >
            {cardsInfo.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "bg-white rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 cursor-default transition-transform hover:scale-[1.02]",
                  isMobile() ? "min-w-[220px] p-3" : "p-4 h-40"
                )}
              >
                <div
                  className="p-3 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: item.color,
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    <b>{item.value}</b>{" "}
                    <span className="text-slate-500 font-normal">
                      {item.description}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
