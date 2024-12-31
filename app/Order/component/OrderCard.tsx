import { OrderItem } from "../types"; 
import { formatDate, formatCurrency } from "../utils/formatters";
import { OrderProductItem } from "./OrderProductItem";
import { OrderActions } from "./OrderAction";
import { getStatusColor } from "../utils/status";
  

interface OrderCardProps {
  order: OrderItem;
  onCancelOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
}

export const OrderCard = ({ order, onCancelOrder, onDeleteOrder }: OrderCardProps) => {
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

      {order.chitietdonhang && order.chitietdonhang.length > 0 ? (
        order.chitietdonhang.map((item, index) => (
          <OrderProductItem key={index} item={item} />
        ))
      ) : (
        <p className="text-sm text-gray-500">
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