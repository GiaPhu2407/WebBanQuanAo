import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    // Parse dữ liệu từ request body
    const body = await request.json();
    const {
      idUsers,
      chitietDonhang,
      trangthai = "Đang xử lý",
      discountCode = null,
    } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!idUsers || !chitietDonhang || chitietDonhang.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết để tạo đơn hàng." },
        { status: 400 }
      );
    }

    // Tính tổng số lượng và tổng số tiền từ danh sách chi tiết đơn hàng
    let tongsoluong = 0;
    let originalTotal = 0; // Tổng tiền gốc trước khi áp dụng giảm giá

    for (const item of chitietDonhang) {
      const { idsanpham, soluong } = item;

      // Lấy thông tin sản phẩm để tính giá
      const sanpham = await prisma.sanpham.findUnique({
        where: { idsanpham },
        select: { gia: true }, // Giá của sản phẩm
      });

      if (!sanpham) {
        return NextResponse.json(
          { error: `Không tìm thấy sản phẩm với ID: ${idsanpham}` },
          { status: 404 }
        );
      }

      // Tính tổng số lượng và tổng số tiền
      tongsoluong += soluong;
      originalTotal += soluong * Number(sanpham.gia);
    }

    // Xử lý mã giảm giá nếu có
    let idDiscount = null;
    let discountValue = 0; // Giá trị giảm giá (số tiền được giảm)
    let finalTotalAmount = originalTotal; // Khởi tạo với giá ban đầu

    if (discountCode) {
      // Tìm mã giảm giá hợp lệ
      const discount = await prisma.discountCode.findFirst({
        where: {
          code: discountCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (!discount) {
        return NextResponse.json(
          { error: "Mã giảm giá không hợp lệ hoặc đã hết hạn." },
          { status: 400 }
        );
      }

      // Kiểm tra giới hạn sử dụng
      if (
        discount.usageLimit !== null &&
        discount.usedCount >= discount.usageLimit
      ) {
        return NextResponse.json(
          { error: "Mã giảm giá đã đạt giới hạn sử dụng." },
          { status: 400 }
        );
      }

      // Kiểm tra giá trị đơn hàng tối thiểu
      if (
        discount.minOrderValue &&
        originalTotal < Number(discount.minOrderValue)
      ) {
        return NextResponse.json(
          {
            error: `Giá trị đơn hàng phải tối thiểu ${formatCurrency(
              Number(discount.minOrderValue)
            )} để sử dụng mã giảm giá này.`,
          },
          { status: 400 }
        );
      }

      // Tính giá trị giảm
      if (discount.discountType === "PERCENTAGE") {
        discountValue = (originalTotal * Number(discount.value)) / 100;

        // Áp dụng giới hạn giảm giá tối đa nếu có
        if (
          discount.maxDiscount &&
          discountValue > Number(discount.maxDiscount)
        ) {
          discountValue = Number(discount.maxDiscount);
        }
      } else {
        // FIXED_AMOUNT
        discountValue = Number(discount.value);
      }

      // Cập nhật số lần sử dụng của mã giảm giá
      await prisma.discountCode.update({
        where: { idDiscount: discount.idDiscount },
        data: { usedCount: { increment: 1 } },
      });

      idDiscount = discount.idDiscount;
      finalTotalAmount = originalTotal - discountValue; // Tính tổng tiền sau khi giảm giá
    }

    // Đảm bảo finalTotalAmount không âm
    finalTotalAmount = Math.max(0, finalTotalAmount);

    // Tạo mới đơn hàng với giá trị đã giảm
    const newDonhang = await prisma.donhang.create({
      data: {
        idUsers,
        tongsoluong,
        tongsotien: finalTotalAmount, // Lưu số tiền sau khi đã giảm giá
        trangthai,
        ngaydat: new Date().toISOString(),
        idDiscount,
        discountValue: discountValue ? new Prisma.Decimal(discountValue) : null, // Lưu giá trị giảm giá (số tiền được giảm)
      },
    });

    // Tạo thông báo với thông tin giảm giá
    const notification = await prisma.notification.create({
      data: {
        idUsers,
        title: "Đơn hàng mới",
        message: `Đơn hàng #${newDonhang.iddonhang} đã được tạo thành công${
          discountValue > 0
            ? ` với giảm giá ${formatCurrency(discountValue)}`
            : ""
        }`,
        type: "order",
        idDonhang: newDonhang.iddonhang,
        isRead: false,
        createdAt: new Date(),
      },
    });

    // Gửi thông báo realtime nếu có pusherServer
    if (pusherServer) {
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        notification
      );
    }

    // Thêm chi tiết đơn hàng
    const createdChitietDonhang = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        // Get product price from database to ensure accuracy
        const sanpham = await prisma.sanpham.findUnique({
          where: { idsanpham: item.idsanpham },
          select: { gia: true },
        });

        return await prisma.chitietDonhang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            dongia: sanpham ? Number(sanpham.gia) : item.dongia, // Use accurate price from DB or fallback to provided price
            idSize: item.idSize || null, // Thêm size nếu có
          },
        });
      })
    );

    // Tạo lịch giao hàng (nếu cần)
    const deliverySchedules = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        return await prisma.lichGiaoHang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            idKhachHang: idUsers,
            NgayGiao: calculateDeliveryDate(),
            TrangThai: "Chờ giao",
          },
        });
      })
    );

    // Trả về thông tin đơn hàng và các chi tiết đã thêm
    return NextResponse.json(
      {
        success: true,
        donhang: newDonhang,
        chitietDonhang: createdChitietDonhang,
        lichGiaoHang: deliverySchedules,
        discountApplied:
          discountValue > 0
            ? {
                code: discountCode,
                value: discountValue,
                originalTotal: originalTotal,
                finalTotal: finalTotalAmount,
              }
            : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo đơn hàng." },
      { status: 500 }
    );
  }
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm tính ngày giao hàng dự kiến
function calculateDeliveryDate(): Date {
  const orderDate = new Date();
  const earliestDeliveryDate = new Date(orderDate);
  earliestDeliveryDate.setDate(orderDate.getDate() + 3);

  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 6);

  const deliveryDate = new Date(
    earliestDeliveryDate.getTime() +
      Math.random() *
        (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
  );

  deliveryDate.setHours(
    8 + Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 60),
    0,
    0
  );
  return deliveryDate;
}

// GET and DELETE methods remain unchanged
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const donhang = await prisma.donhang.findMany({
      where: {
        idUsers: session?.idUsers,
      },
      include: {
        chitietdonhang: {
          include: {
            sanpham: {
              select: {
                tensanpham: true,
                gia: true,
                hinhanh: true,
                gioitinh: true,
              },
            },
          },
        },
        discount: {
          select: {
            code: true,
            discountType: true,
            value: true,
          },
        },
        lichgiaohang: {
          select: {
            NgayGiao: true,
            TrangThai: true,
          },
        },
        thanhtoan: true, // Thêm thông tin thanh toán
      },
      orderBy: {
        ngaydat: "desc",
      },
    });

    if (!donhang.length) {
      return NextResponse.json(
        { message: "Không có đơn hàng nào." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      donhang,
      message: "Lấy danh sách đơn hàng thành công.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const iddonhang = await prisma.donhang.deleteMany();
    return NextResponse.json(
      { iddonhang, message: "Xoá tất cả các đơn hàng" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
