import React, { useState, useEffect, useRef } from "react";
import { Bell, FileText, User, Package, X } from "lucide-react";

interface Order {
  iddonhang: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: Date;
  users: {
    Hoten: string;
    Email: string;
  };
  chitietdonhang: Array<{
    soluong: number;
    dongia: number;
    sanpham: {
      tensanpham: string;
    };
    size: {
      tensize: string;
    };
  }>;
}

interface Notification {
  iddonhang: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: Date;
  users: {
    Hoten: string;
    Email: string;
  };
  chitietdonhang: Array<{
    soluong: number;
    dongia: number;
    sanpham: {
      tensanpham: string;
    };
    size: {
      tensize: string;
    };
  }>;
}

const NotificationComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const notificationListRef = useRef<HTMLDivElement>(null);

  // Handling click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications and orders
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const ordersResponse = await fetch("/api/donhang");
      const ordersData = await ordersResponse.json();
      const pendingOrders = ordersData.filter(
        (order: Order) => order.trangthai === "Chờ xác nhận"
      );
      setOrders(pendingOrders);

      const notificationsResponse = await fetch("/api/thongbao");
      const notificationsData = await notificationsResponse.json();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalNotifications = () => {
    return orders.length + notifications.length;
  };

  const handleOrderClick = (order: Order | Notification) => {
    setSelectedOrder(order as Order);
    setShowOrderDetails(true);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          className="btn btn-ghost btn-circle relative"
          onClick={toggleDropdown}
          aria-label="Notifications"
        >
          <div className="indicator">
            <Bell className="h-5 w-5" />
            {getTotalNotifications() > 0 && (
              <span className="badge badge-sm indicator-item bg-indigo-600 text-white border-none">
                {getTotalNotifications()}
              </span>
            )}
          </div>
        </button>

        {isOpen && (
          <div
            ref={notificationRef}
            className="absolute top-full right-0 mt-2 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
            style={{
              maxHeight: "80vh",
              transform: "translateY(0)",
              animation: "slideDown 0.2s ease-out",
            }}
          >
            <div className="p-0 flex flex-col h-full">
              <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex items-center justify-between sticky top-0 z-[9999]">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">
                    Thông báo ({getTotalNotifications()})
                  </h3>
                </div>
                <button
                  className="hover:bg-indigo-700 p-1 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                ref={notificationListRef}
                className="overflow-y-auto"
                style={{ maxHeight: "calc(80vh - 120px)" }}
              >
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <span className="loading loading-spinner loading-md text-indigo-600"></span>
                  </div>
                ) : (
                  <div>
                    {notifications.length > 0 && (
                      <div className="p-2 bg-gray-100 text-sm font-medium sticky top-0 z-10">
                        Thông báo mới
                      </div>
                    )}

                    {notifications.map((notification) => (
                      <div
                        key={notification.iddonhang}
                        className="border-b last:border-b-0"
                      >
                        <div
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleOrderClick(notification)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  Thông báo mới #{notification.iddonhang}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(notification.ngaydat)}
                                </p>
                              </div>
                            </div>
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Thông báo
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {orders.length > 0 && (
                      <div className="p-2 bg-gray-100 text-sm font-medium sticky top-0 z-10">
                        Đơn hàng chờ xác nhận
                      </div>
                    )}

                    {orders.map((order) => (
                      <div
                        key={order.iddonhang}
                        className="border-b last:border-b-0"
                      >
                        <div
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleOrderClick(order)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="bg-indigo-100 p-2 rounded-full">
                                <Package className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  Đơn hàng #{order.iddonhang}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(order.ngaydat)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {order.users?.Hoten} -{" "}
                                  {formatCurrency(Number(order.tongsotien))}
                                </p>
                              </div>
                            </div>
                            <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                              {order.trangthai}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {getTotalNotifications() === 0 && (
                      <div className="p-8 text-center">
                        <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Không có thông báo mới</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {getTotalNotifications() > 0 && (
                <div className="p-3 border-t text-center mt-auto sticky bottom-0 bg-white">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    onClick={() => {
                      window.location.href = "/admin/thongbao";
                      setIsOpen(false);
                    }}
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl"
            style={{
              animation: "fadeIn 0.2s ease-out",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium">
                {selectedOrder.trangthai === "Chờ xác nhận"
                  ? `Đơn hàng #${selectedOrder.iddonhang}`
                  : `Thông báo #${selectedOrder.iddonhang}`}
              </h3>
              <button
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="p-4 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 160px)" }}
            >
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium">{selectedOrder.users?.Hoten}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.users?.Email}</p>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Chi tiết đơn hàng
              </h4>

              <div className="space-y-3">
                {selectedOrder.chitietdonhang.map((item, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">{item.sanpham.tensanpham}</p>
                      <p className="text-gray-600">x{item.soluong}</p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        Size: {item.size?.tensize}
                      </p>
                      <p className="text-indigo-600 font-medium">
                        {formatCurrency(Number(item.dongia))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Tổng tiền:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(Number(selectedOrder.tongsotien))}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-gray-700">Trạng thái:</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedOrder.trangthai}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Ngày đặt: {formatDate(selectedOrder.ngaydat)}
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={closeModal}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                // onClick={() => {
                //   window.location.href = `/admin/donhang/${selectedOrder.iddonhang}`;
                // }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default NotificationComponent;
