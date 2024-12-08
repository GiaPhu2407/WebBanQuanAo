"use client";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

// Interfaces for our data types
interface OrderItem {
  idsanpham: number;
  tensanpham: string;
  size: string;
  soluong: number;
  dongia: number;
  hinhanh: string;
}

interface Order {
  iddonhang: number;
  tongsoluong: number;
  tongsotien: number;
  trangthai: string;
  ngaydat: string;
  diachi: string;
  sodienthoai: string;
  chitietDonhang: OrderItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with your actual user ID or authentication mechanism
        const response = await fetch("/api/donhang");

        if (!response.ok) {
          throw new Error("Không thể tải đơn hàng");
        }

        const data = await response.json();

        // Ensure the data is an array before updating state
        if (Array.isArray(data.donhang)) {
          setOrders(data.donhang);
        } else {
          throw new Error("Dữ liệu đơn hàng không hợp lệ");
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang xử lý":
        return "text-yellow-600";
      case "Đã giao":
        return "text-green-600";
      case "Đã hủy":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Đơn Hàng Của Bạn</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.iddonhang}
                className="bg-white shadow-md rounded-lg p-6 border"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-semibold">Mã Đơn Hàng:</span>{" "}
                    {order.iddonhang}
                  </div>
                  <div
                    className={`font-semibold ${getStatusColor(
                      order.trangthai
                    )}`}
                  >
                    {order.trangthai}
                  </div>
                </div>

                <div className="mb-4">
                  <p>
                    <span className="font-semibold">Ngày Đặt Hàng:</span>{" "}
                    {formatDate(order.ngaydat)}
                  </p>
                  <p>
                    <span className="font-semibold">Địa Chỉ:</span>{" "}
                    {order.diachi}
                  </p>
                  <p>
                    <span className="font-semibold">Số Điện Thoại:</span>{" "}
                    {order.sodienthoai}
                  </p>
                </div>

                <div className="space-y-4">
                  {order.chitietDonhang.map((item) => (
                    <div
                      key={item.idsanpham}
                      className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.hinhanh}
                        alt={item.tensanpham}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.tensanpham}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Số lượng: {item.soluong}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(item.dongia * item.soluong)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">Tổng Số Lượng:</span>{" "}
                    {order.tongsoluong} sản phẩm
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    Tổng Tiền: {formatCurrency(order.tongsotien)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
