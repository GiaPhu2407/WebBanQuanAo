import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/client";
  

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, paymentMethod } = await req.json();

    // Validate input
    if (!cartItems?.length) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (paymentMethod === "stripe") {
      // Create Stripe checkout session
      const lineItems = cartItems.map((item: any) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.sanpham.tensanpham,
            images: [item.sanpham.hinhanh],
          },
          unit_amount: item.sanpham.gia,
        },
        quantity: item.soluong,
      }));

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        metadata: {
          userId: session.idUsers.toString(),
          cartItems: JSON.stringify(cartItems),
        },
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // Handle regular checkout (COD or other payment methods)
    const result = await prisma.$transaction(async (tx: { donhang: { create: (arg0: { data: { idUsers: any; ngaydat: Date; trangthai: string; tongsotien: number; tongsoluong: any; }; }) => any; }; chitietDonhang: { create: (arg0: { data: { iddonhang: any; idsanpham: any; idSize: any; soluong: any; dongia: any; }; }) => any; }; thanhtoan: { create: (arg0: { data: { iddonhang: any; phuongthucthanhtoan: any; sotien: number; trangthai: string; ngaythanhtoan: Date; }; }) => any; }; giohang: { delete: (arg0: { where: { idgiohang: any; }; }) => any; }; lichGiaoHang: { create: (arg0: { data: { iddonhang: any; idsanpham: any; idKhachHang: any; NgayGiao: Date; TrangThai: string; }; }) => any; }; }) => {
      const allOrders = [];
      const allOrderDetails = [];
      const allPayments = [];
      const allDeliverySchedules = [];

      for (const item of cartItems) {
        // Create order
        const order = await tx.donhang.create({
          data: {
            idUsers: session.idUsers,
            ngaydat: new Date(),
            trangthai: "Chờ xác nhận",
            tongsotien: item.sanpham.gia * item.soluong,
            tongsoluong: item.soluong,
          },
        });
        allOrders.push(order);

        // Create order details
        const orderDetail = await tx.chitietDonhang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            idSize: item.idSize,
            soluong: item.soluong,
            dongia: item.sanpham.gia,
          },
        });
        allOrderDetails.push(orderDetail);

        // Create payment record
        const payment = await tx.thanhtoan.create({
          data: {
            iddonhang: order.iddonhang,
            phuongthucthanhtoan: paymentMethod,
            sotien: item.sanpham.gia * item.soluong,
            trangthai: "Đang xử lý",
            ngaythanhtoan: new Date(),
          },
        });
        allPayments.push(payment);

        // Remove from cart
        await tx.giohang.delete({
          where: {
            idgiohang: item.idgiohang,
          },
        });

        // Create delivery schedule
        const deliverySchedule = await tx.lichGiaoHang.create({
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

function calculateDeliveryDate(): Date {
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
