/* eslint-disable @typescript-eslint/no-explicit-any */
export type NotificationType = "system" | "reminder";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
