// import { NextResponse } from "next/server";
// import { getSession } from "@/lib/auth";
// import prisma from "@/prisma/client";

// // GET route để lấy thông tin đơn hàng theo ID
// export async function GET(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.idUsers;
//     const { searchParams } = new URL(req.url);
//     const orderId = params.orderId || searchParams.get("orderId");
//     const productId = searchParams.get("productId");

//     // Kiểm tra xem có orderId hay không
//     if (!orderId) {
//       return NextResponse.json(
//         { error: "Order ID is required" },
//         { status: 400 }
//       );
//     }

//     const orderIdNum = parseInt(orderId.toString(), 10);
//     if (isNaN(orderIdNum)) {
//       return NextResponse.json(
//         { error: "Invalid order ID format" },
//         { status: 400 }
//       );
//     }

//     // Nếu có productId, trả về thông tin chi tiết của sản phẩm trong đơn hàng cụ thể
//     if (productId) {
//       const productIdNum = parseInt(productId.toString(), 10);
//       if (isNaN(productIdNum)) {
//         return NextResponse.json(
//           { error: "Invalid product ID format" },
//           { status: 400 }
//         );
//       }

//       // Tìm thông tin chi tiết sản phẩm trong đơn hàng
//       const orderItem = await prisma.chitietDonhang.findFirst({
//         where: {
//           iddonhang: orderIdNum,
//           idsanpham: productIdNum,
//           donhang: {
//             idUsers: userId, // Đảm bảo đơn hàng thuộc về người dùng hiện tại
//           },
//         },
//         include: {
//           sanpham: {
//             include: {
//               images: {
//                 select: {
//                   idImage: true,
//                   url: true,
//                 },
//               },
//             },
//           },
//           donhang: {
//             select: {
//               ngaydat: true,
//               trangthai: true,
//               tongsotien: true,
//               lichgiaohang: true,
//               tongsoluong: true,
//               idUsers: true,
//             },
//           },
//         },
//       });

//       if (!orderItem) {
//         return NextResponse.json(
//           { error: "Product not found in this order" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         data: orderItem,
//       });
//     }

//     // Nếu không có productId, trả về toàn bộ thông tin của đơn hàng
//     const order = await prisma.donhang.findUnique({
//       where: {
//         iddonhang: orderIdNum,
//         idUsers: userId, // Đảm bảo đơn hàng thuộc về người dùng hiện tại
//       },
//       include: {
//         chitietdonhang: {
//           include: {
//             sanpham: {
//               select: {
//                 idsanpham: true,
//                 tensanpham: true,
//                 gia: true,
//                 hinhanh: true,
//                 gioitinh: true,
//                 mota: true,
//                 loaisanpham: true,
//                 images: {
//                   select: {
//                     idImage: true,
//                     url: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         users: {
//           select: {
//             Hoten: true,
//             Email: true,
//             Sdt: true,
//           },
//         },
//         lichgiaohang: {
//           select: {
//             NgayGiao: true,
//             TrangThai: true,
//           },
//         },
//         thanhtoan: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Get order details error:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error while retrieving order details",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
