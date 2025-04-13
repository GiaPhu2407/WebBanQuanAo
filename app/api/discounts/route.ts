import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Lấy tất cả mã giảm giá, bao gồm cả những mã đã hết hạn
    const discounts = await prisma.discountCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Đánh dấu các mã đã hết hạn
    const now = new Date();
    const enhancedDiscounts = discounts.map((discount) => ({
      ...discount,
      status: getDiscountStatus(discount, now),
    }));

    return NextResponse.json(enhancedDiscounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách mã giảm giá" },
      { status: 500 }
    );
  }
}

// Hàm xác định trạng thái của mã giảm giá
function getDiscountStatus(discount: any, now: Date) {
  if (!discount.isActive) return "Không hoạt động";
  if (new Date(discount.endDate) < now) return "Đã hết hạn";
  if (new Date(discount.startDate) > now) return "Chưa bắt đầu";
  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit)
    return "Đã đạt giới hạn";
  return "Đang hoạt động";
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    // Kiểm tra các trường bắt buộc
    if (
      !code ||
      !discountType ||
      value === undefined ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra mã giảm giá đã tồn tại chưa
    const existingCode = await prisma.discountCode.findUnique({
      where: { code },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: "Mã giảm giá đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo mã giảm giá mới
    const discount = await prisma.discountCode.create({
      data: {
        code,
        description: description || "",
        discountType,
        value: parseFloat(value),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Tạo mã giảm giá thành công", discount },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating discount:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo mã giảm giá" },
      { status: 500 }
    );
  }
}
