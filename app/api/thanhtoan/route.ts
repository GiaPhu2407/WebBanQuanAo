import prisma from "@/prisma/client";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, paymentMethod } = await req.json();

    const result = await prisma.$transaction(async (prisma) => {
      const allOrders = [];
      const allOrderDetails = [];
      const allPayments = [];
      const allDeliverySchedules = [];

      for (const item of cartItems) {
        // 1. Tạo đơn hàng mới
        const order = await prisma.donhang.create({
          data: {
            idUsers: session.idUsers,
            ngaydat: new Date(),
            trangthai: "Chờ xác nhận",
            tongsotien: item.sanpham.gia * item.soluong,
            tongsoluong: item.soluong,
          },
        });
        allOrders.push(order);

        // 2. Tạo chi tiết đơn hàng
        const orderDetail = await prisma.chitietDonhang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            idSize: item.idSize,
            soluong: item.soluong,
            dongia: item.sanpham.gia,
          },
        });
        allOrderDetails.push(orderDetail);

        // 3. Tạo thanh toán
        const payment = await prisma.thanhtoan.create({
          data: {
            iddonhang: order.iddonhang,
            phuongthucthanhtoan: paymentMethod,
            sotien: item.sanpham.gia * item.soluong,
            trangthai: "Đang xử lý",
            ngaythanhtoan: new Date(),
          },
        });
        allPayments.push(payment);

        // 4. Xóa mặt hàng khỏi giỏ hàng
        await prisma.giohang.delete({
          where: {
            idgiohang: item.idgiohang,
          },
        });

        // 5. Cập nhật trạng thái sản phẩm
        await prisma.sanpham.update({
          where: { idsanpham: item.idsanpham },
          data: { trangthai: "Đã đặt hàng" },
        });

        // 6. Tạo lịch giao hàng
        const deliverySchedule = await prisma.lichGiaoHang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            idKhachHang: session.idUsers,
            NgayGiao: await calculateDeliveryDate(),
            TrangThai: "Chờ giao",
          },
        });
        allDeliverySchedules.push(deliverySchedule);
      }

      return {
        orders: allOrders,
        orderDetails: allOrderDetails,
        payments: allPayments,
        deliverySchedules: allDeliverySchedules,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function calculateDeliveryDate(): Promise<Date> {
  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + Math.floor(Math.random() * 4) + 3);
  deliveryDate.setHours(8 + Math.floor(Math.random() * 4), 0, 0, 0);
  return deliveryDate;
}
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.donhang.findMany({
      where: { idUsers: session.idUsers },
      include: {
        chitietdonhang: {
          include: {
            sanpham: true,
          },
        },
        thanhtoan: true,
        lichgiaohang: true,
      },
      orderBy: { ngaydat: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
