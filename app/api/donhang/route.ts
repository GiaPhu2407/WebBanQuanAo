import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
    let tongsotien = 0;

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
      tongsotien += soluong * Number(sanpham.gia);
    }

    // Xử lý mã giảm giá nếu có
    let idDiscount = null;
    let discountValue = null;
    let finalTotalAmount = tongsotien;

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
        tongsotien < Number(discount.minOrderValue)
      ) {
        return NextResponse.json(
          {
            error: `Giá trị đơn hàng phải tối thiểu ${discount.minOrderValue} để sử dụng mã giảm giá này.`,
          },
          { status: 400 }
        );
      }

      // Tính giá trị giảm
      let calculatedDiscount = 0;
      if (discount.discountType === "PERCENTAGE") {
        calculatedDiscount = (tongsotien * Number(discount.value)) / 100;

        // Áp dụng giới hạn giảm giá tối đa nếu có
        if (
          discount.maxDiscount &&
          calculatedDiscount > Number(discount.maxDiscount)
        ) {
          calculatedDiscount = Number(discount.maxDiscount);
        }
      } else {
        // FIXED_AMOUNT
        calculatedDiscount = Number(discount.value);
      }

      // Cập nhật số lần sử dụng của mã giảm giá
      await prisma.discountCode.update({
        where: { idDiscount: discount.idDiscount },
        data: { usedCount: { increment: 1 } },
      });

      idDiscount = discount.idDiscount;
      discountValue = calculatedDiscount;
      finalTotalAmount = tongsotien - calculatedDiscount;
    }

    // Tạo mới đơn hàng
    const newDonhang = await prisma.donhang.create({
      data: {
        idUsers,
        tongsoluong,
        tongsotien: finalTotalAmount,
        trangthai,
        ngaydat: new Date().toISOString(),
        idDiscount,
        discountValue,
      },
    });

    // Tạo thông báo
    await prisma.notification.create({
      data: {
        idUsers,
        title: "Đơn hàng mới",
        message: `Đơn hàng #${newDonhang.iddonhang} đã được tạo thành công`,
        type: "order",
        idDonhang: newDonhang.iddonhang,
      },
    });

    // Thêm chi tiết đơn hàng
    const createdChitietDonhang = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        return await prisma.chitietDonhang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            dongia: item.dongia, // Giá có thể lấy từ body hoặc sản phẩm
          },
        });
      })
    );

    // Trả về thông tin đơn hàng và các chi tiết đã thêm
    return NextResponse.json(
      {
        donhang: newDonhang,
        chitietDonhang: createdChitietDonhang,
        discountApplied: discountValue
          ? {
              code: discountCode,
              value: discountValue,
              originalTotal: tongsotien,
              finalTotal: finalTotalAmount,
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Donhang:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo đơn hàng." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const donhang = await prisma.donhang.findMany({
      where: {
        idUsers: session.idUsers,
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
      },
    });
    return NextResponse.json(donhang);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const iddonhang = await prisma.donhang.deleteMany();
  return NextResponse.json(
    { iddonhang, message: "Xoá tất cả các id" },
    { status: 200 }
  );
}
