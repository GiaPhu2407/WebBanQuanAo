import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Kiểm tra ID đánh giá
    if (!body.iddanhgia) {
      return NextResponse.json(
        { message: "ID đánh giá không được để trống" },
        { status: 400 }
      );
    }

    // Kiểm tra đánh giá tồn tại
    const existingReview = await prisma.danhgia.findUnique({
      where: { iddanhgia: body.iddanhgia },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Đánh giá không tồn tại" },
        { status: 404 }
      );
    }

    // Validate dữ liệu cập nhật
    const updateData = {
      sao: body.sao ?? existingReview.sao,
      noidung: body.noidung ?? existingReview.noidung,
    };

    const UpdateSchema = z.object({
      sao: z
        .number()
        .min(1, { message: "Số sao phải từ 1 đến 5" })
        .max(5, { message: "Số sao phải từ 1 đến 5" })
        .optional(),
      noidung: z
        .string()
        .min(1, { message: "Nội dung đánh giá không được để trống" })
        .max(45, { message: "Nội dung đánh giá tối đa 45 ký tự" })
        .optional(),
    });

    const validationResult = UpdateSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Cập nhật đánh giá
    const updatedReview = await prisma.danhgia.update({
      where: { iddanhgia: body.iddanhgia },
      data: {
        ...updateData,
        ngaydanhgia: new Date(), // Cập nhật ngày đánh giá
      },
    });

    return NextResponse.json(
      { data: updatedReview, message: "Cập nhật đánh giá thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
