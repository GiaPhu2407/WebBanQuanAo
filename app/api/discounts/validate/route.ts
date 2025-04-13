import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json();
    const currentDate = new Date();

    if (!code) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp mã giảm giá" },
        { status: 400 }
      );
    }

    // Tìm mã giảm giá
    const discount = await prisma.discountCode.findUnique({
      where: {
        code,
        isActive: true,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
    });

    // Nếu không tìm thấy mã giảm giá hoặc không còn hoạt động
    if (!discount) {
      return NextResponse.json(
        { error: "Mã giảm giá không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Kiểm tra giới hạn sử dụng
    if (
      discount.usageLimit !== null &&
      discount.usedCount >= discount.usageLimit
    ) {
      return NextResponse.json(
        { error: "Mã giảm giá đã đạt giới hạn sử dụng" },
        { status: 400 }
      );
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (discount.minOrderValue && orderTotal < Number(discount.minOrderValue)) {
      return NextResponse.json(
        {
          error: `Giá trị đơn hàng phải tối thiểu ${discount.minOrderValue} để sử dụng mã giảm giá này`,
          minOrderValue: discount.minOrderValue,
        },
        { status: 400 }
      );
    }

    // Tính giá trị giảm giá
    let discountAmount = 0;
    if (discount.discountType === "PERCENTAGE") {
      discountAmount = (orderTotal * Number(discount.value)) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(discount.maxDiscount));
      }
    } else {
      discountAmount = Number(discount.value);
    }

    // Trả về thông tin mã giảm giá và giá trị đã tính
    return NextResponse.json({
      success: true,
      discount: {
        idDiscount: discount.idDiscount,
        code: discount.code,
        description: discount.description,
        discountType: discount.discountType,
        value: discount.value,
        calculatedDiscount: discountAmount,
        finalPrice: orderTotal - discountAmount,
      },
    });
  } catch (error) {
    console.error("Error validating discount:", error);
    return NextResponse.json(
      { error: "Lỗi khi xác thực mã giảm giá" },
      { status: 500 }
    );
  }
}
