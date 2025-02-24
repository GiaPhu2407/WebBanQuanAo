"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: {
    orderId: number;
    totalAmount: number;
    customerName: string;
    orderDate: string;
    paymentMethod: string;
    status: string;
  };
  timestamp: string;
  isRead: boolean;
}

export default function AdminNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to Pusher channel
    const channel = pusherClient.subscribe("admin-channel");

    // Listen for new order notifications
    channel.bind("new-order", (data: any) => {
      console.log("Received notification:", data); // Debug log

      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type,
        title: data.title,
        message: data.message,
        data: {
          orderId: data.data.orderId,
          totalAmount: data.data.totalAmount,
          customerName: data.data.customerName,
          orderDate: data.data.orderDate,
          paymentMethod: data.data.paymentMethod,
          status: data.data.status,
        },
        timestamp: data.timestamp || new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((count) => count + 1);

      // Play notification sound
      try {
        const audio = new Audio("/notification-sound.mp3");
        audio
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      } catch (error) {
        console.error("Error with notification sound:", error);
      }
    });

    // Debug log for connection status
    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully subscribed to admin-channel");
    });

    channel.bind("pusher:subscription_error", (error: any) => {
      console.error("Error subscribing to admin-channel:", error);
    });

    return () => {
      console.log("Cleaning up Pusher subscription"); // Debug log
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "stripe":
        return "Thanh toán qua Stripe";
      case "cod":
        return "Thanh toán khi nhận hàng";
      default:
        return method;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-[600px] overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Đánh dấu đã đọc tất cả
                </button>
              )}
            </div>
          </div>

          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{notification.title}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  {notification.type === "order" && notification.data && (
                    <div className="mt-2 text-sm">
                      <p>
                        Tổng tiền:{" "}
                        {formatCurrency(notification.data.totalAmount)}
                      </p>
                      <p>Khách hàng: {notification.data.customerName}</p>
                      <p>
                        Phương thức:{" "}
                        {formatPaymentMethod(notification.data.paymentMethod)}
                      </p>
                      <p>Trạng thái: {notification.data.status}</p>
                      <button
                        className="mt-2 text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/admin/orders/${notification.data.orderId}`;
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
