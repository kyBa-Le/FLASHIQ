/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  Inbox,
  MailOpen,
  Loader2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "@/components/common/NotificationItem";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { NotificationService } from "@/services/notification.service";

export default function NotificationPage() {
  const { notifications, setNotifications, loading, setLoading } =
    useNotificationStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const parseData = (data: any) => {
    if (!data) return null;
    if (typeof data === "object") return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse notification data:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!userId) return;

    const loadInitialNotifications = async () => {
      if (notifications.length === 0) {
        setLoading(true);
      }

      try {
        const data = await NotificationService.fetchAllNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialNotifications();
  }, [userId]);

  const filteredNotifications = useMemo(() => {
    return (notifications || []).filter((n) =>
      filter === "unread" ? !n.isRead : true
    );
  }, [notifications, filter]);

  const selectedNoti = notifications.find((n) => n.id === selectedId);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const noti = notifications.find((n) => n.id === id);
    if (noti && !noti.isRead) {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  if (loading && notifications.length === 0)
    return (
      <div className="flex h-[60vh] items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground italic">Fetching alerts...</span>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-4 pb-10">
      {selectedNoti ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to list
          </Button>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge
                variant={selectedNoti.type ? "secondary" : "default"}
                className="text-white"
              >
                {selectedNoti.type.replace("_", " ")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(selectedNoti.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {selectedNoti.title}
            </h1>
            <Separator />

            <ScrollArea className="h-[500px] pr-4">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line mb-8">
                {selectedNoti.message}
              </p>

              {(() => {
                const meta = parseData(selectedNoti.data);
                if (!meta) return null;
                return (
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 font-bold">
                      <Share2 className="h-5 w-5" />
                      <span>Shared Resource Information</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {meta.permission && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                            Permission
                          </p>
                          <Badge className="bg-secondary hover:bg-secondary border-secondary capitalize">
                            {meta.permission.toLowerCase()} access
                          </Badge>
                        </div>
                      )}
                      {meta.ownerName && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                            From
                          </p>
                          <p className="font-medium text-foreground">
                            {meta.ownerName}
                          </p>
                        </div>
                      )}
                    </div>

                    {meta.setId && (
                      <Button
                        variant="setButton"
                        className="w-full mt-2 flex gap-2"
                        onClick={() =>
                          (window.location.href = `/sets/${meta.setId}/study`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" /> Open This Set
                      </Button>
                    )}
                  </div>
                );
              })()}
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay updated with your latest alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit border shadow-sm">
            <Button
              variant={filter === "all" ? "setButton" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-background shadow-xs" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "setButton" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={`flex gap-2 ${
                filter === "unread" ? "bg-background shadow-xs" : ""
              }`}
            >
              Unread
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <Badge className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {notifications.filter((n) => !n.isRead).length}
                </Badge>
              )}
            </Button>
          </div>

          <div className="grid gap-3 pt-2">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="transition-all hover:translate-x-1 active:scale-[0.99] cursor-pointer"
                >
                  <NotificationItem item={item} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl opacity-50 bg-muted/20">
                {filter === "unread" ? (
                  <MailOpen className="h-10 w-10 mb-2 text-muted-foreground" />
                ) : (
                  <Inbox className="h-10 w-10 mb-2 text-muted-foreground" />
                )}
                <p className="text-sm font-medium">
                  No {filter === "unread" ? "unread" : ""} notifications found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
