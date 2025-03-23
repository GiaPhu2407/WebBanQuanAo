import { formatCurrency } from "../utils/currency";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  selectedItemsCount: number;
  totalItemsCount: number;
  total: number;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onCheckout: () => void;
  processing: boolean;
}

export const CartSummary = ({
  selectedItemsCount,
  totalItemsCount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  processing,
}: CartSummaryProps) => {
  const router = useRouter();

  const handleCheckout = () => {
    // Kiểm tra nếu đã chọn phương thức thanh toán
    if (!paymentMethod) {
      // Hiển thị thông báo lỗi
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    onCheckout();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Thông tin đơn hàng
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Số sản phẩm đã chọn:</span>
          <span className="font-medium">
            {selectedItemsCount}/{totalItemsCount}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tạm tính:</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <span className="text-green-600 font-medium">Miễn phí</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Tổng thanh toán:</span>
            <span className="text-blue-600 text-lg">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium mb-2">
            Phương thức thanh toán:
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán khi nhận hàng</p>
                <p className="text-sm text-gray-500">
                  Thanh toán bằng tiền mặt khi nhận hàng
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán chuyển khoản</p>
                <p className="text-sm text-gray-500">
                  Chuyển khoản ngân hàng & tải ảnh chứng minh
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="STRIPE"
                checked={paymentMethod === "STRIPE"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán Stripe</p>
                <p className="text-sm text-gray-500">
                  Thanh toán bằng thẻ tín dụng/ghi nợ qua Stripe
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
            processing || selectedItemsCount === 0 || !paymentMethod
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={processing || selectedItemsCount === 0 || !paymentMethod}
        >
          {processing ? "Đang xử lý..." : "Tiến hành thanh toán"}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
