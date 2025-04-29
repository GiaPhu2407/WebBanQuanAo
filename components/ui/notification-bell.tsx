"use client";

import { useEffect, useState } from "react";
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

interface NotificationBellProps {
  isAdmin?: boolean;
}

export function NotificationBell({ isAdmin = false }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      // Use different endpoint for admin notifications
      const endpoint = isAdmin
        ? "/api/admin/notification"
        : "/api/notifications";
      const response = await fetch(endpoint);
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

    // Subscribe to the appropriate Pusher channel based on isAdmin prop
    const channelName = isAdmin ? "admin-notifications" : "notifications";
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-notification", (notification: Notification) => {
      console.log(
        `New ${isAdmin ? "admin" : "user"} notification received:`,
        notification
      );
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast for new notification with different styling for admin
      toast({
        title: notification.title,
        description: notification.message,
        variant: isAdmin ? "destructive" : "default",
      });
    });

    // Rest of the bindings remain the same
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
      pusherClient.unsubscribe(channelName);
    };
  }, [isAdmin]); // Add isAdmin to the dependency array

  // Update the markAsRead function to use the correct endpoint
  const markAsRead = async (id: number) => {
    try {
      const endpoint = isAdmin
        ? `/api/admin/notification/${id}`
        : `/api/notifications/${id}`;
      const response = await fetch(endpoint, {
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

  // Update the deleteNotification function to use the correct endpoint
  const deleteNotification = async (id: number) => {
    try {
      const endpoint = isAdmin
        ? `/api/admin/notification/${id}`
        : `/api/notifications/${id}`;
      const response = await fetch(endpoint, {
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

  // Update the clearAllNotifications function to use the correct endpoint
  const clearAllNotifications = async () => {
    try {
      const endpoint = isAdmin
        ? "/api/admin/notification"
        : "/api/notifications";
      const response = await fetch(endpoint, {
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

  // Add a function to get notification type styling
  const getNotificationTypeStyle = (type: string) => {
    switch (type) {
      case "admin_payment":
      case "admin_order":
        return "bg-amber-50 border-l-4 border-amber-500";
      case "payment":
        return "bg-green-50 border-l-4 border-green-500";
      case "order":
        return "bg-blue-50 border-l-4 border-blue-500";
      default:
        return !isAdmin ? "bg-blue-50" : "bg-amber-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Update the notification rendering to include type-based styling
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className={`h-5 w-5 ${isAdmin ? "text-amber-500" : ""}`} />
          {unreadCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 ${
                isAdmin ? "bg-amber-500" : "bg-red-500"
              } text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="font-semibold">
            {isAdmin ? "Thông báo quản trị" : "Thông báo"}
          </h3>
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
                className={`flex flex-col items-start p-3 border-b ${getNotificationTypeStyle(
                  notification.type
                )} ${!notification.isRead ? "font-medium" : ""}`}
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
