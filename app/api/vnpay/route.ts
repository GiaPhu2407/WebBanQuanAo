import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import crypto from "crypto";
import querystring from "querystring";

// Hàm tạo URL thanh toán VNPay
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      cartItems,
      orderId,
      DiscountInfo,
      idDiaChi,
      returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    } = body;

    // Kiểm tra địa chỉ giao hàng
    if (!idDiaChi && !orderId) {
      return NextResponse.json(
        { error: "Vui lòng chọn địa chỉ giao hàng" },
        { status: 400 }
      );
    }

    const userId =
      typeof session.idUsers === "string"
        ? Number.parseInt(session.idUsers, 10)
        : session.idUsers ?? 0; // Ensure userId is a number

    // Tính toán tổng tiền
    let amount = 0;
    let orderIdToUse = orderId;

    if (orderId) {
      // Nếu đã có orderId, lấy thông tin đơn hàng
      const order = await prisma.donhang.findUnique({
        where: { iddonhang: Number(orderId) },
      });
      if (!order) {
        return NextResponse.json(
          { error: "Không tìm thấy đơn hàng" },
          { status: 404 }
        );
      }
      amount = Number(order.tongsotien);
    } else if (cartItems) {
      // Tính tổng tiền từ giỏ hàng
      const originalTotal = cartItems.reduce(
        (sum: number, item: any) =>
          sum + Number(item.sanpham.gia) * item.soluong,
        0
      );

      // Áp dụng giảm giá nếu có
      const discountAmount = DiscountInfo?.calculatedDiscount || 0;
      amount = Math.max(0, originalTotal - discountAmount);
    } else {
      return NextResponse.json(
        { error: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    // Tạo đơn hàng mới nếu chưa có
    if (!orderIdToUse && cartItems) {
      // Tạo đơn hàng mới
      const discountId = DiscountInfo?.idDiscount
        ? Number(DiscountInfo.idDiscount)
        : null;
      const discountAmount = DiscountInfo?.calculatedDiscount || 0;

      const totalQuantity = cartItems.reduce(
        (sum: number, item: any) => sum + item.soluong,
        0
      );

      const order = await prisma.donhang.create({
        data: {
          idUsers: userId,
          ngaydat: new Date(),
          trangthai: "Awaiting payment",
          tongsotien: amount,
          tongsoluong: totalQuantity,
          idDiscount: discountId,
          discountValue: discountAmount,
          idDiaChi: Number(idDiaChi),
        },
      });

      // Tạo chi tiết đơn hàng
      for (const item of cartItems) {
        await prisma.chitietDonhang.create({
          data: {
            iddonhang: order.iddonhang,
            idsanpham: item.idsanpham,
            idSize: item.idSize,
            soluong: item.soluong,
            dongia: Number(item.sanpham.gia),
          },
        });
      }

      orderIdToUse = order.iddonhang;
    }

    // Cấu hình VNPay
    const vnp_TmnCode = process.env.VNPAY_TMN_CODE!;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET!;
    const vnp_Url = process.env.VNPAY_URL!;
    const vnp_ReturnUrl = returnUrl;

    // Tạo tham số thanh toán
    const date = new Date();
    const createDate = formatDate(date);
    const vnp_TxnRef_Value = `${orderIdToUse}-${date.getTime()}`;
    const ipAddr =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Tạo đối tượng tham số thanh toán
    const vnp_Params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: vnp_TxnRef_Value,
      vnp_OrderInfo: `Thanh toan don hang #${orderIdToUse}`,
      vnp_OrderType: "other",
      vnp_Amount: String(amount * 100), // VNPay yêu cầu số tiền * 100
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sắp xếp tham số theo thứ tự
    const sortedParams = sortObject(vnp_Params);

    // Tạo chuỗi ký
    const signData = querystring.stringify(sortedParams, undefined, "&");
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(signData).digest("hex");

    // Thêm chữ ký vào tham số
    sortedParams["vnp_SecureHash"] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${vnp_Url}?${querystring.stringify(
      sortedParams,
      undefined,
      "&"
    )}`;

    // Tạo bản ghi thanh toán
    await prisma.thanhtoan.create({
      data: {
        iddonhang: Number(orderIdToUse),
        phuongthucthanhtoan: "vnpay",
        sotien: amount,
        trangthai: "Pending",
        ngaythanhtoan: new Date(),
        maGiaoDich: vnp_TxnRef_Value,
        vnp_TxnRef: vnp_TxnRef_Value,
        vnp_TransactionNo: null,
        vnp_ResponseCode: null,
      },
    });

    // Cập nhật trạng thái đơn hàng
    await prisma.donhang.update({
      where: { iddonhang: Number(orderIdToUse) },
      data: { trangthai: "Waiting for payment" },
    });

    // Tạo thông báo
    const notification = await prisma.notification.create({
      data: {
        idUsers: userId,
        title: "Thanh toán VNPay",
        message: `Đơn hàng #${orderIdToUse} đang chờ thanh toán qua VNPay`,
        type: "payment",
        idDonhang: Number(orderIdToUse),
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

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId: orderIdToUse,
    });
  } catch (error) {
    console.error("VNPay payment error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xử lý thanh toán VNPay" },
      { status: 500 }
    );
  }
}

// Hàm xử lý callback từ VNPay
export async function GET(req: NextRequest) {
  try {
    // Lấy tất cả các tham số từ URL
    const url = new URL(req.url);
    const params: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

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
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Convert potentially null idUsers to a definite number or undefined
    const userId = order.idUsers !== null ? order.idUsers : undefined;

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

      // Tạo thông báo - sử dụng userId đã xử lý
      const notification = await prisma.notification.create({
        data: {
          idUsers: userId as number, // Type assertion since we're handling null above
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
          where: { idUsers: userId }, // Using userId that's not null
          select: { Email: true },
        });

        if (user?.Email) {
          const { sendPaymentConfirmationEmail } = await import(
            "@/lib/emailOrder"
          );
          await sendPaymentConfirmationEmail(user.Email, {
            orderNumber: orderId, // Changed from orderId to orderNumber
            amount: Number(vnp_Amount) / 100,
            paymentMethod: "VNPay",
            transactionId: vnp_TransactionNo,
          });
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      // Chuyển hướng đến trang thành công
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${orderId}`
      );
    } else {
      // Thanh toán thất bại
      // Cập nhật trạng thái thanh toán
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

      // Tạo thông báo - sử dụng userId đã xử lý
      const notification = await prisma.notification.create({
        data: {
          idUsers: userId as number, // Type assertion since we're handling null above
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

      // Chuyển hướng đến trang thất bại
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?orderId=${orderId}`
      );
    }
  } catch (error) {
    console.error("VNPay callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`
    );
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

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}
