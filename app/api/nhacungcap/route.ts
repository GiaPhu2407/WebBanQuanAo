import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const SupplierSchema = z.object({
  tennhacungcap: z
    .string()
    .min(3, { message: "Tên nhà cung cấp phải có ít nhất 3 ký tự" })
    .max(255, { message: "Tên nhà cung cấp có độ dài tối đa là 255 ký tự" }),
  sodienthoai: z
    .string()
    .length(10, { message: "Số điện thoại phải có đúng 10 ký tự" })
    .optional(),
  diachi: z
    .string()
    .max(45, { message: "Địa chỉ không được vượt quá 45 ký tự" })
    .optional(),
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .max(45, { message: "Email có độ dài tối đa là 45 ký tự" }),
  trangthai: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Lấy dữ liệu từ yêu cầu
    const body = await request.json();

    // Xác thực dữ liệu với Zod
    const validationResult = SupplierSchema.safeParse({
      tennhacungcap: body.tennhacungcap,
      sodienthoai: body.sodienthoai,
      diachi: body.diachi,
      email: body.email,
      trangthai: body.trangthai,
    });

    // Nếu dữ liệu không hợp lệ thì trả về lỗi
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Kiểm tra trùng lặp tên nhà cung cấp hoặc email
    const existingSupplier = await prisma.nhacungcap.findFirst({
      where: {
        OR: [{ tennhacungcap: body.tennhacungcap }, { email: body.email }],
      },
    });

    if (existingSupplier) {
      const conflictField =
        existingSupplier.email === body.email ? "Email" : "Tên nhà cung cấp";
      return NextResponse.json(
        { message: `${conflictField} đã tồn tại` },
        { status: 400 }
      );
    }

    // Thêm nhà cung cấp mới vào cơ sở dữ liệu
    const nhacungcap = await prisma.nhacungcap.create({
      data: {
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai ?? null,
        diachi: body.diachi ?? null,
        email: body.email,
        trangthai: body.trangthai ?? false,
      },
    });

    // Trả về kết quả
    return NextResponse.json(
      { nhacungcap, message: "Thêm mới nhà cung cấp thành công" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi thêm nhà cung cấp:", error);
    return NextResponse.json(
      {
        message: "Đã xảy ra lỗi trong quá trình thêm nhà cung cấp",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const nhacungcap = await prisma.nhacungcap.findMany({
      orderBy: {
        idnhacungcap: "asc",
      },
    });
    return NextResponse.json(nhacungcap);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách nhà cung cấp" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const nhacungcap = await prisma.nhacungcap.deleteMany();
    return NextResponse.json(
      { message: "Đã xoá tất cả nhà cung cấp" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xoá nhà cung cấp:", error);
    return NextResponse.json(
      { error: "Lỗi khi xoá nhà cung cấp" },
      { status: 500 }
    );
  }
}
