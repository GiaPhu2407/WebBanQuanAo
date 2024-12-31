import Image from "next/image";
import { OrderDetail } from "../types";
import { formatCurrency } from "../utils/formatters";

interface OrderProductItemProps {
  item: OrderDetail;
}

export const OrderProductItem = ({ item }: OrderProductItemProps) => {
  return (
    <div className="flex items-start gap-4 border-t border-gray-200 py-4">
      {item.sanpham?.hinhanh ? (
        <div className="relative w-20 h-20">
          <Image
            src={item.sanpham.hinhanh}
            alt={item.sanpham.tensanpham || "Sản phẩm"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-gray-800 font-medium">
          {item.sanpham?.tensanpham || "Sản phẩm không xác định"}
        </h3>
        {item.sanpham?.gioitinh !== undefined && (
          <p className="text-gray-500 text-sm">
            Giới tính: {item.sanpham.gioitinh ? "Nam" : "Nữ"}
          </p>
        )}
        <p className="text-gray-500 text-sm">{item.sanpham?.mota || ""}</p>
        <p className="text-gray-700 font-semibold">
          {item.soluong} x {formatCurrency(item.dongia)}
        </p>
        {item.sanpham?.kichthuoc && (
          <p className="text-gray-500 text-sm">
            Kích thước: {item.sanpham.kichthuoc}
          </p>
        )}
      </div>
    </div>
  );
};