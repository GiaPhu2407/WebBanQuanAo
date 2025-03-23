// import { NextResponse } from "next/server";
// import { getSession } from "@/lib/auth";
// import prisma from "@/prisma/client";

// export async function POST(req: Request) {
//   try {
//     const session = await getSession();
//     // if (!session) {
//     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     // }

//     const formData = await req.formData();
//     const orderId = formData.get("orderId");
//     const paymentProof = formData.get("paymentProof");

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

//     // Find the order and verify it belongs to the user
//     const order = await prisma.donhang.findFirst({
//       where: {
//         iddonhang: orderIdNum,
//         idUsers: session.idUsers,
//       },
//       include: {
//         thanhtoan: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json(
//         { error: "Order not found or unauthorized" },
//         { status: 404 }
//       );
//     }

//     // Handle payment proof image
//     let paymentProofUrl = null;
//     if (paymentProof && paymentProof instanceof File) {
//       const arrayBuffer = await paymentProof.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       paymentProofUrl = `data:${paymentProof.type};base64,${buffer.toString(
//         "base64"
//       )}`;
//     }

//     // Update or create payment record
//     const payment = await prisma.thanhtoan.upsert({
//       where: {
//         iddonhang: orderIdNum,
//       },
//       update: {
//         trangthai: "Đã thanh toán, chờ xác nhận",
//         ngaythanhtoan: new Date(),
//         hinhanhthanhtoan: paymentProofUrl,
//         phuongthucthanhtoan: "Chuyển khoản",
//       },
//       create: {
//         iddonhang: orderIdNum,
//         trangthai: "Đã thanh toán, chờ xác nhận",
//         ngaythanhtoan: new Date(),
//         phuongthucthanhtoan: "Chuyển khoản",
//         sotien: order.tongsotien,
//         hinhanhthanhtoan: paymentProofUrl,
//       },
//     });

//     // Update order status
//     const updatedOrder = await prisma.donhang.update({
//       where: {
//         iddonhang: orderIdNum,
//       },
//       data: {
//         trangthai: "Đã thanh toán, chờ xác nhận",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: {
//         payment,
//         order: updatedOrder,
//       },
//     });
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error during payment verification",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const session = await getSession();
//     const donhang = await prisma.donhang.findMany({
//       where: {
//         idUsers: session.idUsers,
//       },
//       include: {
//         chitietdonhang: {
//           include: {
//             sanpham: {
//               select: {
//                 tensanpham: true,
//                 gia: true,
//                 hinhanh: true,
//                 gioitinh: true,
//               },
//             },
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
//     return NextResponse.json(donhang);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message });
//   }
// }
