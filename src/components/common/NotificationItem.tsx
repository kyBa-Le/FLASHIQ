import { Card } from "@/components/ui/card";
import { NOTIFICATION_UI } from "@/constants/notification-ui";
import type { Notification } from "@/types/notification.type";
import { cn } from "@/lib/utils";

interface Props {
  item: Notification;
}

export default function NotificationItem({ item }: Props) {
  const ui = NOTIFICATION_UI[item.type] || NOTIFICATION_UI.system;

  return (
    <li className="list-none">
      <Card
        variant="flashcard"
        className={cn(
          "group relative hover:bg-muted/50 transition cursor-pointer p-5",
          !item.isRead ? "!bg-blue-50/50 dark:!bg-blue-900/10" : "!bg-white" 
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={ui.image}
              alt={ui.label}
              className="h-12 w-12 object-cover border border-muted"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                {ui.label}
              </span>
            </div>

            <h3
              className={cn(
                "line-clamp-1 text-sm leading-tight transition-colors",
                !item.isRead
                  ? "font-bold text-slate-900 dark:text-slate-100"
                  : "font-medium text-slate-600 dark:text-slate-400"
              )}
            >
              {item.title}
            </h3>

            <span className="text-[11px] text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {!item.isRead && (
          <span className="absolute top-1/2 -translate-y-1/2 right-4 h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
        )}
      </Card>
    </li>
  );
}
