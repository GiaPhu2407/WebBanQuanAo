import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation cho Danhgia
const DanhGiaSchema = z.object({
  idsanpham: z.number({
    required_error: "ID sản phẩm không được để trống",
  }),
  idUsers: z.number({
    required_error: "ID người dùng không được để trống",
  }),
  sao: z
    .number()
    .min(1, { message: "Số sao phải từ 1 đến 5" })
    .max(5, { message: "Số sao phải từ 1 đến 5" }),
  noidung: z
    .string()
    .min(1, { message: "Nội dung đánh giá không được để trống" })
    .max(45, { message: "Nội dung đánh giá tối đa 45 ký tự" }),
});

// POST - Tạo đánh giá mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate dữ liệu đầu vào
    const validationResult = DanhGiaSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm và người dùng tồn tại
    const [sanpham, user] = await Promise.all([
      prisma.sanpham.findUnique({
        where: { idsanpham: body.idsanpham },
      }),
      prisma.users.findUnique({
        where: { idUsers: body.idUsers },
      }),
    ]);

    if (!sanpham || !user) {
      return NextResponse.json(
        { message: "Sản phẩm hoặc người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Kiểm tra đánh giá đã tồn tại
    const existingReview = await prisma.danhgia.findFirst({
      where: {
        idsanpham: body.idsanpham,
        idUsers: body.idUsers,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "Bạn đã đánh giá sản phẩm này rồi" },
        { status: 400 }
      );
    }

    // Tạo đánh giá mới
    const newReview = await prisma.danhgia.create({
      data: {
        idsanpham: body.idsanpham,
        idUsers: body.idUsers,
        sao: body.sao,
        noidung: body.noidung,
        ngaydanhgia: new Date(),
      },
    });

    return NextResponse.json(
      { data: newReview, message: "Thêm đánh giá thành công" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
