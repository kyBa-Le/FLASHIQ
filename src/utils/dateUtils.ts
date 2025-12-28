import { isToday, isYesterday, parseISO } from "date-fns";
import type{ SetItem } from "@/types/types";

export const groupSetsByDate = (sets: SetItem[]) => {
  const groups = {
    today: [] as SetItem[],
    yesterday: [] as SetItem[],
    others: [] as SetItem[],
  };

  sets.forEach((set) => {
    const dateStr = set.updatedAt || set.createdAt;
    if (!dateStr) return;

    const date =
      typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);

    if (isToday(date)) {
      groups.today.push(set);
    } else if (isYesterday(date)) {
      groups.yesterday.push(set);
    } else {
      groups.others.push(set);
    }
  });

  return groups;
};
