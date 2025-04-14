import { useState } from "react";
import { formatCurrency } from "../utils/currency";

interface CartSummaryProps {
  selectedItemsCount: number;
  totalItemsCount: number;
  total: number;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onCheckout: (discountInfo?: any) => void;
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
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState("");
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);

  const fetchAvailableDiscounts = async () => {
    try {
      setIsLoadingDiscounts(true);
      const response = await fetch("/api/discounts");
      const data = await response.json();
      setAvailableDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoadingDiscounts(false);
    }
  };

  const applyDiscountCode = async (code: string) => {
    try {
      setDiscountError("");
      const response = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal: total }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDiscountError(data.error);
        setAppliedDiscount(null);
        return;
      }

      setAppliedDiscount(data.discount);
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountError("Error applying discount code");
    }
  };

  const finalTotal = appliedDiscount
    ? total - appliedDiscount.calculatedDiscount
    : total;

  const handleCheckout = () => {
    onCheckout(appliedDiscount);
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

        {/* Discount Code Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => applyDiscountCode(discountCode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!discountCode}
            >
              Áp dụng
            </button>
          </div>

          {discountError && (
            <p className="text-red-500 text-sm">{discountError}</p>
          )}

          {appliedDiscount && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-700">
                Đã áp dụng mã giảm giá: {appliedDiscount.code}
              </p>
              <p className="text-sm text-green-600">
                Tiết kiệm: {formatCurrency(appliedDiscount.calculatedDiscount)}
              </p>
            </div>
          )}

          {/* Available Discounts */}
          <button
            onClick={fetchAvailableDiscounts}
            className="text-blue-600 text-sm hover:underline"
          >
            Xem các mã giảm giá hiện có
          </button>

          {isLoadingDiscounts ? (
            <p>Đang tải mã giảm giá...</p>
          ) : (
            availableDiscounts.length > 0 && (
              <div className="mt-2 space-y-2">
                {availableDiscounts.map((discount) => (
                  <div
                    key={discount.idDiscount}
                    className="border p-2 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setDiscountCode(discount.code);
                      applyDiscountCode(discount.code);
                    }}
                  >
                    <p className="font-medium">{discount.code}</p>
                    <p className="text-sm text-gray-600">
                      {discount.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Giảm:{" "}
                      {discount.discountType === "PERCENTAGE"
                        ? `${discount.value}%`
                        : formatCurrency(Number(discount.value))}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <span className="text-green-600 font-medium">Miễn phí</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Tổng thanh toán:</span>
            <span className="text-blue-600 text-lg">
              {formatCurrency(finalTotal)}
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
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán qua Stripe</p>
                <p className="text-sm text-gray-500">
                  Thanh toán an toàn bằng thẻ tín dụng/ghi nợ
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
