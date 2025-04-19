import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

// PUT handler for updating reviews
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = parseInt(params.id);
    const body = await request.json();

    // Check if review exists
    const existingReview = await prisma.danhgia.findUnique({
      where: { iddanhgia: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Đánh giá không tồn tại" },
        { status: 404 }
      );
    }

    // Validate update data
    const UpdateSchema = z.object({
      sao: z
        .number()
        .min(1, { message: "Số sao phải từ 1 đến 5" })
        .max(5, { message: "Số sao phải từ 1 đến 5" }),
      noidung: z
        .string()
        .min(1, { message: "Nội dung đánh giá không được để trống" })
        .max(256, { message: "Nội dung đánh giá tối đa 256 ký tự" }),
    });

    const validationResult = UpdateSchema.safeParse({
      sao: body.sao,
      noidung: body.noidung,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Update review
    const updatedReview = await prisma.danhgia.update({
      where: { iddanhgia: reviewId },
      data: {
        sao: body.sao,
        noidung: body.noidung,
        ngaydanhgia: new Date(),
      },
      include: {
        users: {
          select: {
            Tentaikhoan: true,
            Hoten: true,
            // Avatar: true,
          },
        },
        sanpham: {
          select: {
            tensanpham: true,
            hinhanh: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: updatedReview,
        message: "Cập nhật đánh giá thành công",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// DELETE handler for removing reviews
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = parseInt(params.id);

    // Check if review exists
    const existingReview = await prisma.danhgia.findUnique({
      where: { iddanhgia: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Đánh giá không tồn tại" },
        { status: 404 }
      );
    }

    // Delete review
    await prisma.danhgia.delete({
      where: { iddanhgia: reviewId },
    });

    return NextResponse.json(
      { message: "Xóa đánh giá thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
