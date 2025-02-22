import { OrderItem } from "../types";
import { formatDate, formatCurrency } from "../utils/formatters";
import { OrderActions } from "./OrderAction";
import { getStatusColor } from "../utils/status";
import { OrderProductItem } from "./OrderProductItem";
import Image from "next/image";

// Hàm helper để lấy URL tuyệt đối
const getAbsoluteImageUrl = (relativeUrl: string) => {
  if (!relativeUrl) return "";

  // Nếu đã là URL tuyệt đối, trả về nguyên gốc
  if (relativeUrl.startsWith("http")) {
    return relativeUrl;
  }

  // Nếu là URL tương đối, thêm domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
};

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
                    src={getAbsoluteImageUrl(item.sanpham.hinhanh)}
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
// "use client";
// import React, { useEffect, useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import Image from "next/image";
// import Footer from "@/app/component/Footer";

// interface OrderItem {
//   iddonhang: number;
//   ngaydat: string;
//   trangthai: string;
//   tongsotien: number;
//   chitietdonhang: OrderDetail[];
//   lichGiaoHang?: DeliverySchedule[];
//   thanhtoan: Payment[];
// }

// interface OrderDetail {
//   idSize: any;
//   idsanpham: number;
//   soluong: number;
//   dongia: number;
//   sanpham: Product;
// }

// interface Product {
//   tensanpham: string;
//   hinhanh: string;
//   mota: string;
//   kichthuoc: string;
//   gioitinh?: boolean;
// }

// interface DeliverySchedule {
//   NgayGiao: string;
//   TrangThai: string;
// }

// interface Payment {
//   phuongthucthanhtoan: string;
//   ngaythanhtoan: string;
// }

// const OrderPage = () => {
//   const [orders, setOrders] = useState<OrderItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("/api/donhang");
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error(
//         "There has been a problem with your fetch operation:",
//         error
//       );
//       setError("Không thể tải danh sách đơn hàng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     const confirmed = await new Promise((resolve) => {
//       toast.custom(
//         (t) => (
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <div className="flex flex-col gap-2">
//               <p className="font-medium">Bạn có chắc muốn hủy đơn hàng này?</p>
//               <div className="flex gap-2">
//                 <button
//                   className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   onClick={() => {
//                     toast.dismiss(t.id);
//                     resolve(true);
//                   }}
//                 >
//                   Hủy đơn
//                 </button>
//                 <button
//                   className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                   onClick={() => {
//                     toast.dismiss(t.id);
//                     resolve(false);
//                   }}
//                 >
//                   Đóng
//                 </button>
//               </div>
//             </div>
//           </div>
//         ),
//         {
//           duration: Infinity,
//         }
//       );
//     });

//     if (confirmed) {
//       try {
//         const response = await fetch(`/api/donhang/${id}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         setOrders((prevOrders) =>
//           prevOrders.map((order) => {
//             if (order.iddonhang === id) {
//               return {
//                 ...order,
//                 trangthai: "Đã hủy",
//               };
//             }
//             return order;
//           })
//         );

//         toast.success("Đã hủy đơn hàng thành công");
//       } catch (error) {
//         console.error("Error deleting order:", error);
//         toast.error("Không thể hủy đơn hàng");
//       }
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "đang xử lý":
//         return "bg-yellow-100 text-yellow-800";
//       case "đã xác nhận":
//         return "bg-blue-100 text-blue-800";
//       case "đang giao":
//         return "bg-purple-100 text-purple-800";
//       case "đã giao":
//         return "bg-green-100 text-green-800";
//       case "đã hủy":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getAbsoluteImageUrl = (relativeUrl: string) => {
//     if (!relativeUrl) return "";
//     if (relativeUrl.startsWith("http")) {
//       return relativeUrl;
//     }
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
//     return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
//   };

//   if (loading) {
//     return (
//       <div
//         className="flex justify-center items-center h-screen"
//         data-theme="light"
//       >
//         <span className="loading loading-spinner text-blue-600 loading-lg"></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div data-theme="light">
//       <Toaster position="top-center" />
//       <div className="container mx-auto px-20 py-28">
//         <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

//         {orders.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             Bạn chưa có đơn hàng nào
//           </div>
//         ) : (
//           <div className="flex flex-wrap flex-shrink justify-stretch gap-12">
//             {orders.map((order) => (
//               <div
//                 key={order.iddonhang}
//                 className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <span className="text-gray-600">Mã đơn hàng: </span>
//                     <span className="font-semibold">#{order.iddonhang}</span>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                       order.trangthai
//                     )}`}
//                   >
//                     {order.trangthai}
//                   </span>
//                 </div>

//                 {order.chitietdonhang.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center gap-4 border-t pt-4"
//                   >
//                     <div className="w-24 h-24 relative flex-shrink-0">
//                       <Image
//                         src={getAbsoluteImageUrl(item.sanpham.hinhanh)}
//                         alt={item.sanpham.tensanpham}
//                         fill
//                         className="object-cover rounded-lg"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-lg mb-1">
//                         {item.sanpham.tensanpham}
//                       </h3>
//                       {item.idSize && (
//                         <p className="text-gray-600 mb-1">
//                           Size: <span>{item.idSize}</span>
//                         </p>
//                       )}
//                       <p className="text-gray-600">
//                         Đơn giá:{" "}
//                         {new Intl.NumberFormat("vi-VN", {
//                           style: "currency",
//                           currency: "VND",
//                         }).format(item.dongia)}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Số lượng: {item.soluong}
//                       </p>
//                     </div>
//                   </div>
//                 ))}

//                 {order.lichGiaoHang && order.lichGiaoHang.length > 0 && (
//                   <div className="bg-white p-4 rounded-lg border-blue-500">
//                     <h4 className="text-lg font-semibold mb-2 text-blue-800">
//                       Dự Kiến Giao Hàng
//                     </h4>
//                     {order.lichGiaoHang.map((schedule, index) => (
//                       <div key={index} className="flex items-center gap-2 mb-2">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 text-blue-600"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h1zm5 0a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V8a1 1 0 011-1h1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span className="font-medium text-blue-800">
//                           {new Date(schedule.NgayGiao).toLocaleString("vi-VN", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center border-t pt-4">
//                   <div>
//                     <span className="text-gray-600">Ngày đặt hàng: </span>
//                     <span className="font-bold text-lg">
//                       {new Date(order.ngaydat).toLocaleDateString("vi-VN")}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Tổng tiền: </span>
//                     <span className="font-bold text-lg">
//                       {new Intl.NumberFormat("vi-VN", {
//                         style: "currency",
//                         currency: "VND",
//                       }).format(order.tongsotien)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   {order.thanhtoan &&
//                     order.thanhtoan.length > 0 &&
//                     order.thanhtoan.map((payment, index) => (
//                       <p key={index} className="text-sm text-gray-500">
//                         Thanh toán bằng: {payment.phuongthucthanhtoan} vào{" "}
//                         {new Date(payment.ngaythanhtoan).toLocaleDateString(
//                           "vi-VN"
//                         )}
//                       </p>
//                     ))}
//                 </div>

//                 <div className="flex justify-end items-center gap-4">
//                   {order.trangthai === "Chờ xác nhận" && (
//                     <button
//                       onClick={() => handleDelete(order.iddonhang)}
//                       className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
//                     >
//                       Hủy đơn
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default OrderPage;
