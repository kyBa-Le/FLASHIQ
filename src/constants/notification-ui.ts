import type { NotificationType } from "@/types/notification.type";

const NOTISYSTEM_SRC = "/assets/noti-system.png";
const NOTIREMIND_SRC = "/assets/noti-remind.png";

export const NOTIFICATION_UI: Record<
  NotificationType,
  {
    label: string;
    image: string;
    unreadBg: string;
  }
> = {
  system: {
    label: "System",
    image: NOTISYSTEM_SRC,
    unreadBg: "bg-blue-50",
  },
  reminder: {
    label: "Reminder",
    image: NOTIREMIND_SRC,
    unreadBg: "bg-yellow-50",
  },
};
