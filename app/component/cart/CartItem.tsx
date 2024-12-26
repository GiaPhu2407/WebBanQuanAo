import { CartItemType } from "../type/cart";
import { formatCurrency } from "../utils/currency";
import { calculateDiscountedPrice } from "../utils/price";

  
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onToggleSelect: (id: number) => void;
  isProcessing: boolean;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  isProcessing
}: CartItemProps) => {
  const originalPrice = item.sanpham?.gia ?? 0;
  const discountPercent = item.sanpham?.giamgia ?? 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercent);
  const itemTotal = discountedPrice * item.soluong;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-gray-200 py-6 last:border-0">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={item.isSelected}
          onChange={() => onToggleSelect(item.idgiohang)}
          className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>

      <img
        src={item.sanpham?.hinhanh}
        alt={item.sanpham?.tensanpham}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {item.sanpham?.tensanpham}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {item.sanpham?.mota}
        </p>

        <div className="space-y-1">
          <p className="text-gray-500 text-sm">
            Size: <span className="font-medium">{item.size?.tenSize}</span>
          </p>
          <p className="text-gray-500 text-sm">
            Phân loại:{' '}
            <span className="font-medium">
              {item.sanpham?.gioitinh ? 'Nam' : 'Nữ'}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <p className="font-bold text-blue-600">
              {formatCurrency(discountedPrice)}
            </p>
            {discountPercent > 0 && item.sanpham?.gia && (
              <>
                <p className="text-gray-400 line-through text-sm">
                  {formatCurrency(item.sanpham.gia)}
                </p>
                <span className="text-red-500 text-sm">-{discountPercent}%</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.idgiohang, item.soluong - 1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center transition duration-200"
          >
            -
          </button>
          <span className="text-lg min-w-[40px] text-center">{item.soluong}</span>
          <button
            onClick={() => onUpdateQuantity(item.idgiohang, item.soluong + 1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center transition duration-200"
          >
            +
          </button>
        </div>

        <p className="font-semibold text-blue-600">
          Tổng: {formatCurrency(itemTotal)}
        </p>
        <button
          onClick={() => onRemove(item.idgiohang)}
          className="text-red-500 hover:text-red-700 text-sm transition duration-200"
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xóa...' : 'Xóa'}
        </button>
      </div>
    </div>
  );
};