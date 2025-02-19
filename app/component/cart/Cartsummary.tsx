import { formatCurrency } from "../utils/currency";

  

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
  processing
}: CartSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Thông tin đơn hàng
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Số sản phẩm đã chọn:</span>
          <span>{selectedItemsCount}/{totalItemsCount}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tạm tính:</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <span>Miễn phí</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Tổng thanh toán:</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Phương thức thanh toán:
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
          >
            <option value="">Chọn phương thức thanh toán</option>
            <option value="cash">Thanh toán khi nhận hàng</option>
            <option value="online">Thanh toán online</option>
            <option value="STRIPE">Thanh toán Stripe</option>
          </select>
        </div>

        <button
          onClick={onCheckout}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
            processing || selectedItemsCount === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={processing || selectedItemsCount === 0}
        >
          {processing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
        </button>
      </div>
    </div>
  );
};