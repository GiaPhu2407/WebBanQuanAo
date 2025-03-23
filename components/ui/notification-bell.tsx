"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  idNotification: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        updateUnreadCount(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const updateUnreadCount = (notifs = notifications) => {
    const count = notifs.filter((n) => !n.isRead).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    // Fetch existing notifications on component mount
    fetchNotifications();

    // Subscribe to Pusher channel
    const channel = pusherClient.subscribe("notifications");

    channel.bind("new-notification", (notification: Notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast for new notification
      toast({
        title: notification.title,
        description: notification.message,
      });
    });

    channel.bind("delete-notification", (data: { idNotification: number }) => {
      setNotifications((prev) =>
        prev.filter((n) => n.idNotification !== data.idNotification)
      );
      updateUnreadCount();
    });

    channel.bind("clear-all-notifications", () => {
      setNotifications([]);
      setUnreadCount(0);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("notifications");
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.idNotification === id ? { ...n, isRead: true } : n
          )
        );
        updateUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.idNotification !== id));
        updateUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có thông báo nào
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.idNotification}
                className={`flex flex-col items-start p-3 border-b ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="font-semibold">{notification.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.idNotification);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Xóa
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
                  <span>{formatDate(notification.createdAt)}</span>
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.idNotification);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
