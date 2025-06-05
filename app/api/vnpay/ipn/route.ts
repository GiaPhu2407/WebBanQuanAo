import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import querystring from "querystring";
import prisma from "@/prisma/client";

// Hàm xử lý IPN (Instant Payment Notification) từ VNPay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Sao chép tham số để xử lý
    const params = { ...body };

    // Lấy chữ ký từ VNPay
    const vnp_SecureHash = params["vnp_SecureHash"];
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    // Sắp xếp tham số
    const sortedParams = sortObject(params);

    // Tạo chuỗi ký
    const signData = querystring.stringify(sortedParams, undefined, "&");
    const hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET!);
    const signed = hmac.update(signData).digest("hex");

    // Kiểm tra chữ ký
    if (vnp_SecureHash !== signed) {
      return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
    }

    // Lấy thông tin giao dịch
    const vnp_ResponseCode = params["vnp_ResponseCode"];
    const vnp_TxnRef = params["vnp_TxnRef"];
    const vnp_Amount = params["vnp_Amount"];
    const vnp_TransactionNo = params["vnp_TransactionNo"];

    // Lấy ID đơn hàng từ mã giao dịch
    const orderIdParts = vnp_TxnRef.split("-");
    const orderId = Number(orderIdParts[0]);

    // Kiểm tra đơn hàng
    const order = await prisma.donhang.findUnique({
      where: { iddonhang: orderId },
      include: {
        thanhtoan: {
          where: { phuongthucthanhtoan: "vnpay" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }

    // Kiểm tra trạng thái thanh toán
    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      // Cập nhật trạng thái thanh toán
      if (order.thanhtoan && order.thanhtoan.length > 0) {
        await prisma.thanhtoan.update({
          where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
          data: {
            trangthai: "Completed",
            maGiaoDich: vnp_TransactionNo,
            vnp_TransactionNo: vnp_TransactionNo,
            vnp_ResponseCode: vnp_ResponseCode,
          },
        });
      }

      // Cập nhật trạng thái đơn hàng
      await prisma.donhang.update({
        where: { iddonhang: orderId },
        data: { trangthai: "Processing" },
      });

      // Tạo thông báo
      const notification = await prisma.notification.create({
        data: {
          idUsers: order.idUsers ?? undefined, // Fix: Convert null to undefined if needed
          title: "Thanh toán thành công",
          message: `Thanh toán đơn hàng #${orderId} qua VNPay đã thành công`,
          type: "payment",
          idDonhang: orderId,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Gửi thông báo realtime
      const { pusherServer } = await import("@/lib/pusher");
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        notification
      );

      // Gửi email xác nhận
      try {
        const user = await prisma.users.findUnique({
          where: { idUsers: order.idUsers ?? undefined }, // Fix: Convert null to undefined if needed
          select: { Email: true },
        });

        if (user?.Email) {
          try {
            const { sendPaymentConfirmationEmail } = await import(
              "@/lib/emailOrder"
            );
            await sendPaymentConfirmationEmail(user.Email, {
              orderNumber: orderId, // Thay đổi từ orderId sang orderNumber
              amount: Number(vnp_Amount) / 100,
              paymentMethod: "VNPay",
              transactionId: vnp_TransactionNo,
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
          }
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    } else {
      // Thanh toán thất bại
      if (order.thanhtoan && order.thanhtoan.length > 0) {
        await prisma.thanhtoan.update({
          where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
          data: {
            trangthai: "Failed",
            maGiaoDich: vnp_TransactionNo,
            vnp_TransactionNo: vnp_TransactionNo,
            vnp_ResponseCode: vnp_ResponseCode,
          },
        });
      }

      // Cập nhật trạng thái đơn hàng
      await prisma.donhang.update({
        where: { iddonhang: orderId },
        data: { trangthai: "Payment Failed" },
      });

      // Tạo thông báo
      const notification = await prisma.notification.create({
        data: {
          idUsers: order.idUsers ?? undefined, // Fix: Convert null to undefined if needed
          title: "Thanh toán thất bại",
          message: `Thanh toán đơn hàng #${orderId} qua VNPay không thành công`,
          type: "payment",
          idDonhang: orderId,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Gửi thông báo realtime
      const { pusherServer } = await import("@/lib/pusher");
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        notification
      );
    }

    // Trả về kết quả cho VNPay
    return NextResponse.json({ RspCode: "00", Message: "Confirmed" });
  } catch (error) {
    console.error("VNPay IPN error:", error);
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}

// Hàm hỗ trợ
function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted;
}
