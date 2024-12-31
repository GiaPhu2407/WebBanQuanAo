// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast, Toaster } from "react-hot-toast";
// import Header from "../Header";
// import Footer from "../Footer";
// import Image from "next/image";

// interface OrderItem {
//   iddonhang: number;
//   ngaydat: string;
//   trangthai: string;
//   tongsotien: number;
//   chitietdonhang: {
//     idsanpham: number;
//     soluong: number;
//     dongia: number;
//     sanpham: {
//       tensanpham: string;
//       hinhanh: string;
//       mota: string;
//       kichthuoc: string;
//       gioitinh?: boolean;
//     };
//   }[];
//   lichGiaoHang?: {
//     NgayGiao: string;
//     TrangThai: string;
//   }[];
//   thanhtoan: {
//     phuongthucthanhtoan: string;
//     ngaythanhtoan: string;
//   }[];
// }

// const OrderPage: React.FC = () => {
//   const [orders, setOrders] = useState<OrderItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchOrders();

//     // Optional: WebSocket for real-time updates
//     const ws = new WebSocket("ws://your-websocket-url");

//     ws.onmessage = (event) => {
//       const updatedOrder: OrderItem = JSON.parse(event.data);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.iddonhang === updatedOrder.iddonhang ? updatedOrder : order
//         )
//       );
//       toast.success("Đơn hàng đã được cập nhật");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("/api/thanhtoan");
//       if (!response.ok) {
//         throw new Error("Không thể tải đơn hàng");
//       }
//       const data = await response.json();
//       setOrders(data.data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("Có lỗi xảy ra khi tải đơn hàng");
//       toast.error("Không thể tải đơn hàng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelOrder = async (orderId: number) => {
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
//         { duration: Infinity }
//       );
//     });

//     if (confirmed) {
//       try {
//         const response = await fetch(`/api/donhang/${orderId}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) {
//           throw new Error(`Không thể hủy đơn hàng`);
//         }

//         setOrders((prevOrders) =>
//           prevOrders.filter((order) => order.iddonhang !== orderId)
//         );

//         toast.success("Đã hủy đơn hàng thành công");
//       } catch (error) {
//         console.error("Error deleting order:", error);
//         toast.error("Không thể hủy đơn hàng");
//       }
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const statusColors: { [key: string]: string } = {
//       "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
//       "Đã xác nhận": "bg-blue-100 text-blue-800",
//       "Đang giao": "bg-purple-100 text-purple-800",
//       "Đã giao": "bg-green-100 text-green-800",
//       "Đã hủy": "bg-red-100 text-red-800",
//     };
//     return statusColors[status] || "bg-gray-100 text-gray-800";
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <Toaster position="top-right" />

//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của bạn</h1>
//           <button
//             onClick={() => router.push("/")}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
//           >
//             Tiếp tục mua sắm
//           </button>
//         </div>

//         {orders.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <p className="text-gray-500 text-xl mb-4">
//               Bạn chưa có đơn hàng nào
//             </p>
//             <button
//               onClick={() => router.push("/")}
//               className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
//             >
//               Bắt đầu mua sắm
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order.iddonhang}
//                 className="bg-white rounded-lg shadow-sm p-6"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       Đơn hàng #{order.iddonhang}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       Đặt ngày: {formatDate(order.ngaydat)}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                       order.trangthai
//                     )}`}
//                   >
//                     {order.trangthai}
//                   </span>
//                 </div>

//                 {order.chitietdonhang && order.chitietdonhang.length > 0 ? (
//                   order.chitietdonhang.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-start gap-4 border-t border-gray-200 py-4"
//                     >
//                       {item.sanpham?.hinhanh ? (
//                         <div className="relative w-20 h-20">
//                           <Image
//                             src={item.sanpham.hinhanh}
//                             alt={item.sanpham.tensanpham || "Sản phẩm"}
//                             fill
//                             className="object-cover rounded-lg"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
//                           <span className="text-gray-400">No image</span>
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <h3 className="text-gray-800 font-medium">
//                           {item.sanpham?.tensanpham || "Sản phẩm không xác định"}
//                         </h3>
//                         {item.sanpham?.gioitinh !== undefined && (
//                           <p className="text-gray-500 text-sm">
//                             Giới tính: {item.sanpham.gioitinh ? "Nam" : "Nữ"}
//                           </p>
//                         )}
//                         <p className="text-gray-500 text-sm">
//                           {item.sanpham?.mota || ""}
//                         </p>
//                         <p className="text-gray-700 font-semibold">
//                           {item.soluong} x {item.dongia.toLocaleString("vi-VN")}{" "}
//                           đ
//                         </p>
//                         {item.sanpham?.kichthuoc && (
//                           <p className="text-gray-500 text-sm">
//                             Kích thước: {item.sanpham.kichthuoc}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">
//                     Không có sản phẩm nào trong đơn hàng này
//                   </p>
//                 )}

//                 <div className="mt-4 flex justify-between items-center border-t pt-4">
//                   <span className="text-gray-700 font-semibold">
//                     Tổng tiền:{" "}
//                     {order.tongsotien
//                       ? order.tongsotien.toLocaleString("vi-VN")
//                       : "0"}{" "}
//                     đ
//                   </span>
//                   <div>
//                     {order.thanhtoan?.map((payment, index) => (
//                       <p key={index} className="text-sm text-gray-500">
//                         Thanh toán bằng: {payment.phuongthucthanhtoan} vào{" "}
//                         {formatDate(payment.ngaythanhtoan)}
//                       </p>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   {order.lichGiaoHang?.map((schedule, index) => (
//                     <div
//                       key={index}
//                       className="flex justify-between items-center mb-2"
//                     >
//                       <span className="text-sm text-gray-500">
//                         Dự kiến giao vào {formatDate(schedule.NgayGiao)}
//                       </span>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                           schedule.TrangThai
//                         )}`}
//                       >
//                         {schedule.TrangThai}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {order.trangthai !== "Đã hủy" && order.trangthai !== "Đã giao" && (
//                   <div className="flex justify-end mt-4">
//                     <button
//                       className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-md transition duration-200"
//                       onClick={() => handleCancelOrder(order.iddonhang)}
//                     >
//                       Hủy đơn
//                     </button>
//                   </div>
//                 )}
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

"use client";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Header from "../Header";
import Footer from "../Footer";
import { OrderCard } from "@/app/Order/component/OrderCard";
import { useOrders } from "@/app/Order/hook/useOrder";
import { EmptyState } from "@/app/Order/component/EmptyState";
import LoadingSpinner from "@/app/Order/component/LoadingSpinner";
  

const OrderPage = () => {
  const router = useRouter();
  const { orders, loading, error, handleCancelOrder, handleDeleteOrder } = useOrders();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của bạn</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        {orders.length === 0 ? (
          <EmptyState onShopNow={() => router.push("/")} />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.iddonhang}
                order={order}
                onCancelOrder={handleCancelOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;