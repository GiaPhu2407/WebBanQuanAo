import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getSession } from "@/lib/auth";
import { sendPaymentConfirmationEmail } from "@/lib/emailOrder";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const payment = await prisma.thanhtoan.findUnique({
      where: { idthanhtoan: id },
      include: {
        donhang: {
          include: {
            users: true,
            chitietdonhang: {
              include: {
                sanpham: true,
                size: true,
              },
            },
            discount: true,
            diaChiGiaoHang: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Thanh toán không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const data = await req.json();
    const {
      iddonhang,
      phuongthucthanhtoan,
      sotien,
      trangthai,
      ngaythanhtoan,
      sendEmail,
    } = data;

    // Validate required fields
    if (!iddonhang || !phuongthucthanhtoan || !sotien) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Get the payment before updating to check if status has changed
    const existingPayment = await prisma.thanhtoan.findUnique({
      where: { idthanhtoan: id },
      include: {
        donhang: {
          include: {
            users: true,
            chitietdonhang: {
              include: {
                sanpham: true,
                size: true,
              },
            },
            discount: true,
            diaChiGiaoHang: true,
          },
        },
      },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Thanh toán không tồn tại" },
        { status: 404 }
      );
    }

    // Update the payment
    const updatedPayment = await prisma.thanhtoan.update({
      where: { idthanhtoan: id },
      data: {
        iddonhang: Number(iddonhang), // Ensure iddonhang is a number
        phuongthucthanhtoan,
        sotien,
        trangthai,
        ngaythanhtoan: ngaythanhtoan ? new Date(ngaythanhtoan) : undefined,
      },
      include: {
        donhang: {
          include: {
            users: true,
            chitietdonhang: {
              include: {
                sanpham: true,
                size: true,
              },
            },
            discount: true,
            diaChiGiaoHang: true,
          },
        },
      },
    });

    // Update order status if payment status is "Thành công" or "Đã thanh toán"
    if (
      (trangthai === "Thành công" || trangthai === "Đã thanh toán") &&
      updatedPayment.donhang
    ) {
      await prisma.donhang.update({
        where: { iddonhang: Number(updatedPayment.iddonhang) }, // Ensure iddonhang is a number
        data: {
          trangthai: "Đã thanh toán",
        },
      });
    }

    let emailSent = false;

    // Send email notification if requested and status has changed
    if (
      sendEmail &&
      existingPayment.trangthai !== trangthai &&
      updatedPayment.donhang?.users?.Email &&
      (trangthai === "Thành công" || trangthai === "Đã thanh toán")
    ) {
      try {
        const order = updatedPayment.donhang;
        // Check if order and order.users exist
        if (!order || !order.users) {
          throw new Error("Order or user information is missing");
        }

        const userEmail = order.users.Email;
        // Check if userEmail exists
        if (!userEmail) {
          throw new Error("User email is missing");
        }

        // Tạo đối tượng PaymentConfirmation phù hợp với interface yêu cầu
        const paymentConfirmation = {
          orderNumber: Number(order.iddonhang),
          amount: Number(updatedPayment.sotien || 0),
          paymentMethod: updatedPayment.phuongthucthanhtoan || "",
          transactionId: `PAY-${updatedPayment.idthanhtoan}-${Date.now()
            .toString()
            .substring(7)}`,
        };

        await sendPaymentConfirmationEmail(userEmail, paymentConfirmation);
        emailSent = true;
        console.log(`Payment confirmation email sent to ${userEmail}`);
      } catch (emailError) {
        console.error("Error sending payment confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      message: "Cập nhật thanh toán thành công",
      data: updatedPayment,
      emailSent,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Check if payment exists
    const existingPayment = await prisma.thanhtoan.findUnique({
      where: { idthanhtoan: id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Thanh toán không tồn tại" },
        { status: 404 }
      );
    }

    // Delete the payment
    await prisma.thanhtoan.delete({
      where: { idthanhtoan: id },
    });

    return NextResponse.json({
      message: "Xóa thanh toán thành công",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
