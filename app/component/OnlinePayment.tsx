"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Fileupload from "@/components/ui/Fileupload";
import qr from "@/app/image/qr.jpg";
import { formatCurrency } from "./utils/currency";

interface Size {
  tenSize: string;
}

interface Sanpham {
  tensanpham: string;
  gia: number;
  hinhanh: string;
}

interface OrderItem {
  idsanpham: number;
  soluong: number;
  size: Size;
  sanpham: Sanpham;
  idgiohang?: number;
}

interface OrderDetails {
  items: OrderItem[];
  total: number;
  orderId: number;
}

interface OnlinePaymentProps {
  orderDetails: OrderDetails;
  onPaymentComplete?: () => void;
}

export const OnlinePayment = ({
  orderDetails,
  onPaymentComplete,
}: OnlinePaymentProps) => {
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Detailed validation of order details
  useEffect(() => {
    if (!orderDetails || !orderDetails.orderId) {
      console.error("Invalid order details:", orderDetails);
      toast.error("Thông tin đơn hàng không hợp lệ");
      router.push("/component/Order");
    }
  }, [orderDetails, router]);

  const handleSubmitPayment = async () => {
    // Comprehensive validation before submission
    if (!paymentProofImage) {
      toast.error("Vui lòng tải lên ảnh chứng minh thanh toán");
      return;
    }

    if (isSubmitting) return;

    if (!orderDetails || !orderDetails.orderId) {
      toast.error("Thông tin đơn hàng không hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "online",
          imageURL: paymentProofImage,
          orderId: orderDetails.orderId,
          cartItems: orderDetails.items,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Thanh toán thất bại");
      }

      if (result.success) {
        // Improved success handling
        toast.success("Gửi xác nhận thanh toán thành công", {
          duration: 3000,
          position: "top-center",
        });

        // Trigger payment complete callback if provided
        if (onPaymentComplete) {
          onPaymentComplete();
        }

        // Delayed navigation to ensure toast is visible
        setTimeout(() => {
          router.push("/component/Order");
        }, 2000);
      } else {
        // Handle case where success is false but no error was thrown
        toast.error("Không thể xác nhận thanh toán. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xử lý thanh toán", {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced error state rendering
  if (!orderDetails || !orderDetails.orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
              Lỗi đơn hàng
            </h2>
            <p className="text-center text-gray-700 mb-4">
              Không thể tìm thấy thông tin đơn hàng hợp lệ.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/component/Order")}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Về trang đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Thanh toán chuyển khoản
            </h2>

            <div className="space-y-6">
              {/* Order Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Chi tiết đơn hàng #{orderDetails.orderId}
                </h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.sanpham.hinhanh}
                          alt={item.sanpham.tensanpham}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">
                            {item.sanpham.tensanpham}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size?.tenSize || "Không xác định"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.soluong}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.sanpham.gia * item.soluong)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4">
                    <span className="font-bold">Tổng tiền:</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatCurrency(orderDetails.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quét mã QR để thanh toán
                </h3>
                <div className="bg-white p-4 inline-block rounded-lg shadow-md">
                  <Image
                    src={qr}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn
                </p>
              </div>

              {/* Bank Transfer Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thông tin chuyển khoản
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">Techcombank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-mono font-medium">
                      19032845710016
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">
                      CÔNG TY TNHH THƯƠNG MẠI XYZ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Nội dung chuyển khoản:
                    </span>
                    <span className="font-mono font-medium">
                      #{orderDetails.orderId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tải lên ảnh chứng minh thanh toán
                </h3>
                <div className="mt-2">
                  <div className="flex flex-col items-center justify-center">
                    {paymentProofImage ? (
                      <div className="relative">
                        <img
                          src={paymentProofImage}
                          alt="Payment proof"
                          className="max-w-xs rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => setPaymentProofImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                          aria-label="Xóa ảnh"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <Fileupload
                        endpoint="imageUploader"
                        onChange={(url) => {
                          if (url) {
                            setPaymentProofImage(url);
                            console.log("Đã tải lên ảnh:", url);
                          }
                        }}
                        showmodal={!paymentProofImage}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={!paymentProofImage || isSubmitting}
                  className={`px-6 py-2 rounded-md text-white ${
                    !paymentProofImage || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlinePayment;
