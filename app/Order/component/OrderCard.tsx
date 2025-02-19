import { OrderItem } from "../types";
import { formatDate, formatCurrency } from "../utils/formatters";
import { OrderActions } from "./OrderAction";
import { getStatusColor } from "../utils/status";
import { OrderProductItem } from "./OrderProductItem";
import Image from "next/image";

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
                    src={item.sanpham.hinhanh}
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
                  {item.idSize && <p className="mt-1">Size: {item.idSize}</p>}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Thành tiền: {formatCurrency(item.soluong * item.dongia)}
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
