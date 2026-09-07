import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Video, MessageSquare, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface NotificationItem {
  id: string;
  type: "live" | "discussion" | "quiz" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      type: "live",
      title: "Live Class Starting Soon",
      message: "Mastering RTK Query & Redux 9 live stream starts in 15 minutes!",
      timestamp: "5m ago",
      isRead: false,
    },
    {
      id: "notif-2",
      type: "discussion",
      title: "New Answer on Your Question",
      message: "Tapas Adhikary replied to your thread in Module 1 Lesson 2.",
      timestamp: "1h ago",
      isRead: false,
    },
    {
      id: "notif-3",
      type: "quiz",
      title: "Quiz Result Graded",
      message: "You scored 100% on the Advanced React Hooks Assessment!",
      timestamp: "1 day ago",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "live":
        return <Video className="h-4 w-4 text-sky-500" />;
      case "discussion":
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case "quiz":
        return <Award className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground h-9 w-9 focus-visible:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-background animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-popover text-popover-foreground shadow-2xl border z-50 animate-in fade-in-0 zoom-in-95 duration-150 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <Badge className="bg-sky-600 text-white text-[10px] px-1.5 py-0">
                  {unreadCount} new
                </Badge>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-sky-600 hover:text-sky-700 h-auto p-0 flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No notifications available.
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 text-xs space-y-1 transition-colors ${
                    !item.isRead ? "bg-sky-500/5 dark:bg-sky-950/20 font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      {getIcon(item.type)}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-5">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
