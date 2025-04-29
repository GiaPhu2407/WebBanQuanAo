import { useState, useEffect } from "react";
import { OrderItem } from "../types";
import { formatDate, formatCurrency } from "../utils/formatters";
import { OrderActions } from "./OrderAction";
import { getStatusColor } from "../utils/status";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { showConfirmDialog } from "../utils/dialog";

// Hàm helper để lấy URL tuyệt đối
const getAbsoluteImageUrl = (relativeUrl: string) => {
  if (!relativeUrl) return "";

  // Nếu đã là URL tuyệt đối, trả về nguyên gốc
  if (relativeUrl.startsWith("http")) {
    return relativeUrl;
  }

  // Nếu là URL tương đối, thêm domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
};

// API services for orders
export const fetchOrders = async (): Promise<OrderItem[]> => {
  const response = await fetch("/api/thanhtoan");
  if (!response.ok) {
    throw new Error("Không thể tải đơn hàng");
  }
  const data = await response.json();
  return data.data || [];
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  const response = await fetch(`/api/donhang/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Không thể xóa đơn hàng");
  }
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  const response = await fetch(`/api/donhang/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trangthai: "Đã hủy" }),
  });

  if (!response.ok) {
    throw new Error("Không thể hủy đơn hàng");
  }
};

// Hook for order management
export const useOrders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    setupWebSocket();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Có lỗi xảy ra khi tải đơn hàng");
      toast.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket("ws://your-websocket-url");
    ws.onmessage = (event) => {
      const updatedOrder: OrderItem = JSON.parse(event.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.iddonhang === updatedOrder.iddonhang ? updatedOrder : order
        )
      );
      toast.success("Đơn hàng đã được cập nhật");
    };
    return () => ws.close();
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmed = await showConfirmDialog(
      "Bạn có chắc muốn xóa đơn hàng này?"
    );

    if (confirmed) {
      try {
        await deleteOrder(orderId);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.iddonhang !== orderId)
        );
        toast.success("Đã xóa đơn hàng thành công");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Không thể xóa đơn hàng");
      }
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = await showConfirmDialog(
      "Bạn có chắc muốn hủy đơn hàng này?"
    );

    if (confirmed) {
      try {
        await cancelOrder(orderId);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.iddonhang === orderId
              ? { ...order, trangthai: "Đã hủy" }
              : order
          )
        );
        toast.success("Đã hủy đơn hàng thành công");
      } catch (error) {
        console.error("Error canceling order:", error);
        toast.error("Không thể hủy đơn hàng");
      }
    }
  };

  return {
    orders,
    loading,
    error,
    handleCancelOrder,
    handleDeleteOrder,
  };
};

// OrderCard component
interface OrderCardProps {
  order: OrderItem;
  onCancelOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
}

export const OrderCard = ({
  order,
  onCancelOrder,
  onDeleteOrder,
}: OrderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Đơn hàng #{order.iddonhang}
          </h2>
          <p className="text-sm text-gray-500">
            Đặt ngày: {formatDate(order.ngaydat)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.trangthai
          )}`}
        >
          {order.trangthai}
        </span>
      </div>

      {/* Delivery Address Section */}
      {order.diaChiGiaoHang && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Địa chỉ giao hàng:
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-medium text-gray-700">
              {order.diaChiGiaoHang.tenNguoiNhan} -{" "}
              {order.diaChiGiaoHang.soDienThoai}
            </p>
            <p>
              {order.diaChiGiaoHang.diaChiChiTiet},{" "}
              {order.diaChiGiaoHang.phuongXa}, {order.diaChiGiaoHang.quanHuyen},{" "}
              {order.diaChiGiaoHang.thanhPho}
            </p>
          </div>
        </div>
      )}

      {order.chitietdonhang && order.chitietdonhang.length > 0 ? (
        <div className="space-y-4 mb-4">
          <h3 className="text-md font-medium text-gray-800">
            Sản phẩm đã đặt:
          </h3>
          {order.chitietdonhang.map((item, index) => (
            <div key={index} className="flex items-start border-b pb-4">
              <div className="w-20 h-20 relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.sanpham?.hinhanh ? (
                  <Image
                    src={getAbsoluteImageUrl(item.sanpham.hinhanh)}
                    alt={item.sanpham.tensanpham || "Sản phẩm"}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-medium text-gray-900">
                  {item.sanpham?.tensanpham || "Sản phẩm không rõ"}
                </h4>
                <div className="mt-1 text-sm text-gray-500">
                  <p>
                    Số lượng: {item.soluong} x {formatCurrency(item.dongia)}
                  </p>
                  <p className="mt-1">Size: {item.idSize || "Không có size"}</p>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Thành tiền:{" "}
                  {formatCurrency(item.soluong * Number(item.dongia))}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          Không có sản phẩm nào trong đơn hàng này
        </p>
      )}

      <div className="mt-4 flex justify-between items-center border-t pt-4">
        <span className="text-gray-700 font-semibold">
          Tổng tiền: {formatCurrency(order.tongsotien)}
        </span>
        <div>
          {order.thanhtoan?.map((payment, index) => (
            <p key={index} className="text-sm text-gray-500">
              Thanh toán bằng: {payment.phuongthucthanhtoan} vào{" "}
              {formatDate(payment.ngaythanhtoan)}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {order.lichGiaoHang?.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Dự kiến giao vào {formatDate(schedule.NgayGiao)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                schedule.TrangThai
              )}`}
            >
              {schedule.TrangThai}
            </span>
          </div>
        ))}
      </div>

      <OrderActions
        orderId={order.iddonhang}
        status={order.trangthai}
        onCancel={onCancelOrder}
        onDelete={onDeleteOrder}
      />
    </div>
  );
};
