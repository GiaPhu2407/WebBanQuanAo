"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function VNPayCancel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      router.push("/");
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderDetails(data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Thanh toán không thành công
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Thanh toán qua VNPay không thành công hoặc đã bị hủy.
          </p>

          {orderDetails && (
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">#{orderDetails.iddonhang}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Ngày đặt hàng:</span>
                <span className="font-medium">
                  {new Date(orderDetails.ngaydat).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-red-600">
                  Chưa thanh toán
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <Link
              href={`/checkout?orderId=${orderDetails?.iddonhang}`}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition duration-200"
            >
              Thử thanh toán lại
            </Link>
            <Link
              href="/component/Order"
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md text-center transition duration-200"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              href="/"
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md text-center transition duration-200"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
