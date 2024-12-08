import { getSession } from '@/lib/auth';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { cartItems, paymentMethod } = await req.json();

    const result = await prisma.$transaction(async (prisma) => {
      const allOrders: any[] = [];
      const allPayments: any[] = [];
      const allDeliverySchedules: any[] = [];
      const allOrderDetails: any[] = [];

      for (const item of cartItems) {
        // 1. Tạo đơn hàng mới
        const order = await prisma.donhang.create({
          data: {
            idUsers: session.idUsers,
            ngaydat: new Date(),
            trangthai: 'Chờ xác nhận',
            tongsotien: Number(item.sanpham.gia) * item.SoLuong,
          },
        });
        allOrders.push(order);

        // 2. Tạo chi tiết đơn hàng
        const orderDetail = await prisma.chitietDonhang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            dongia: item.sanpham?.gia || 0,
          },
        });
        allOrderDetails.push(orderDetail);

        // 3. Tạo bản ghi thanh toán
        const payment = await prisma.thanhtoan.create({
          data: {
            iddonhang: order.iddonhang,
            phuongthucthanhtoan: paymentMethod,
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

        // 5. Cập nhật trạng thái xe
        await prisma.sanpham.update({
          where: {
            idsanpham: item.idXe,
          },
          data: {
            trangthai: 'Đã đặt hàng',
          },
        });

        // 6. Tạo lịch giao hàng
        const deliverySchedule = await prisma.lichGiaoHang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            idKhachHang: session.idUsers,
            NgayGiao: await calculateDeliveryDate(),
            TrangThai: 'Chờ giao',
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
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}

async function calculateDeliveryDate(): Promise<Date> {
  // Logic để tính ngày giao hàng dự kiến
  const orderDate = new Date();
  const earliestDeliveryDate = new Date(orderDate);
  earliestDeliveryDate.setDate(orderDate.getDate() + 3);

  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 6);

  const deliveryDate = new Date(
    earliestDeliveryDate.getTime() +
      Math.random() * (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
  );

  deliveryDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);

  return deliveryDate;
}