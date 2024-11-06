import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client"; // Ensure this path matches your project structure

// Define the schema for validating the supplier data
const SupplierSchema = z.object({
  tennhacungcap: z.string().min(1, "Tên nhà cung cấp không được bỏ trống"),
  sodienthoai: z
    .string()
    .length(10, "Số điện thoại phải có 10 ký tự")
    .optional(),
  diachi: z.string().max(45, "Địa chỉ không được vượt quá 45 ký tự").optional(),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(45, "Email không được vượt quá 45 ký tự")
    .optional(),
  trangthai: z.boolean(),
});

// import prisma from "@/prisma/client";
// import { NextRequest, NextResponse } from "next/server";
// import { SupplierSchema } from "@/app/zodschema/route"; // Đảm bảo đường dẫn chính xác

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const validationResult = SupplierSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Tìm ID nhà cung cấp lớn nhất trong cơ sở dữ liệu
    const maxIdSupplier = await prisma.nhacungcap.findFirst({
      orderBy: {
        idnhacungcap: 'desc',  // Lấy ID lớn nhất
      },
      select: {
        idnhacungcap: true,
      },
    });

    // Tính toán ID tiếp theo
    const nextId = maxIdSupplier ? maxIdSupplier.idnhacungcap + 1 : 1;

    // Create new supplier with nextId
    const nhacungcap = await prisma.nhacungcap.create({
      data: {
        idnhacungcap: nextId,  // Đặt ID mới theo thứ tự tăng dần
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai,
        diachi: body.diachi,
        email: body.email,
        trangthai: body.trangthai, // true for "Đang cung cấp", false for "Ngừng cung cấp"
      },
    });

    return NextResponse.json(
      { nhacungcap, message: "Thêm nhà cung cấp thành công" },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error in POST:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  const nhacungcap = await prisma.nhacungcap.findMany();
  return NextResponse.json(
    { nhacungcap, message: "Liệt kê tất cả các nhà cung cấp" },
    { status: 200 }
  );
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const nhacungcap = await prisma.nhacungcap.deleteMany();
  return NextResponse.json(
    { nhacungcap, message: "Dã xoá tất cả" },
    { status: 200 }
  );
}
