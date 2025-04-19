import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json();
    const currentDate = new Date();

    const discount = await prisma.discountCode.findFirst({
      where: {
        code,
        isActive: true,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Mã giảm giá không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json(
        { error: "Mã giảm giá đã hết lượt sử dụng" },
        { status: 400 }
      );
    }

    if (discount.minOrderValue && orderTotal < Number(discount.minOrderValue)) {
      return NextResponse.json(
        { error: `Giá trị đơn hàng tối thiểu ${discount.minOrderValue}đ` },
        { status: 400 }
      );
    }

    let calculatedDiscount = 0;
    if (discount.discountType === "PERCENTAGE") {
      calculatedDiscount = (orderTotal * Number(discount.value)) / 100;
      if (discount.maxDiscount) {
        calculatedDiscount = Math.min(
          calculatedDiscount,
          Number(discount.maxDiscount)
        );
      }
    } else {
      calculatedDiscount = Number(discount.value);
    }

    // Format the response to match the expected structure
    const formattedDiscount = {
      idDiscount: discount.idDiscount,
      code: discount.code,
      discountType: discount.discountType,
      value: Number(discount.value),
      calculatedDiscount: calculatedDiscount,
      maxDiscount: discount.maxDiscount ? Number(discount.maxDiscount) : null,
    };

    console.log("Sending discount response:", formattedDiscount);

    return NextResponse.json({
      success: true,
      discount: formattedDiscount,
    });
  } catch (error) {
    console.error("Error validating discount:", error);
    return NextResponse.json(
      { error: "Error validating discount" },
      { status: 500 }
    );
  }
}
