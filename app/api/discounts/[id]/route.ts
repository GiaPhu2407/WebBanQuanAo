import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { idDiscount: id },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Không tìm thấy mã giảm giá" },
        { status: 404 }
      );
    }

    // Lấy thêm thông tin về các đơn hàng đã sử dụng mã này
    const orders = await prisma.donhang.findMany({
      where: { idDiscount: id },
      select: {
        iddonhang: true,
        tongsotien: true,
        discountValue: true,
        ngaydat: true,
        users: {
          select: {
            Hoten: true,
            Email: true,
          },
        },
      },
      orderBy: { ngaydat: "desc" },
    });

    return NextResponse.json({
      ...discount,
      orders,
    });
  } catch (error) {
    console.error("Error fetching discount:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin mã giảm giá" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await request.json();
    const {
      code,
      description,
      discountType,
      value,
      minOrderValue,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      isActive,
    } = body;

    // Kiểm tra xem mã giảm giá tồn tại không
    const existingDiscount = await prisma.discountCode.findUnique({
      where: { idDiscount: id },
    });

    if (!existingDiscount) {
      return NextResponse.json(
        { error: "Không tìm thấy mã giảm giá" },
        { status: 404 }
      );
    }

    // Nếu code thay đổi, kiểm tra xem có trùng lặp không
    if (code !== existingDiscount.code) {
      const duplicateCode = await prisma.discountCode.findFirst({
        where: {
          code,
          idDiscount: { not: id },
        },
      });

      if (duplicateCode) {
        return NextResponse.json(
          { error: "Mã giảm giá này đã tồn tại" },
          { status: 400 }
        );
      }
    }

    // Cập nhật mã giảm giá
    const updatedDiscount = await prisma.discountCode.update({
      where: { idDiscount: id },
      data: {
        code,
        description,
        discountType,
        value: parseFloat(value),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      message: "Cập nhật mã giảm giá thành công",
      discount: updatedDiscount,
    });
  } catch (error) {
    console.error("Error updating discount:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật mã giảm giá" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra xem mã giảm giá đã được sử dụng chưa
    const usedInOrders = await prisma.donhang.findFirst({
      where: { idDiscount: id },
    });

    if (usedInOrders) {
      // Thay vì xóa, chỉ đánh dấu là không hoạt động
      await prisma.discountCode.update({
        where: { idDiscount: id },
        data: { isActive: false },
      });

      return NextResponse.json(
        {
          message:
            "Mã giảm giá đã được sử dụng trong đơn hàng nên không thể xóa. Đã đánh dấu là không hoạt động.",
          deactivated: true,
        },
        { status: 200 }
      );
    }

    // Nếu chưa được sử dụng, có thể xóa an toàn
    await prisma.discountCode.delete({
      where: { idDiscount: id },
    });

    return NextResponse.json(
      { message: "Xóa mã giảm giá thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting discount:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa mã giảm giá" },
      { status: 500 }
    );
  }
}
