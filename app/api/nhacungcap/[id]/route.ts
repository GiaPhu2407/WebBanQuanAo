import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { SupplierSchema } from "@/app/zodschema/route"; // Đảm bảo đường dẫn đúng

export async function PUT(req: NextRequest) {
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

    // Kiểm tra xem id của nhà cung cấp có được cung cấp không
    if (!body.id) {
      return NextResponse.json(
        { error: "ID nhà cung cấp không được cung cấp" },
        { status: 400 }
      );
    }

    // Cập nhật nhà cung cấp
    const nhacungcap = await prisma.nhacungcap.update({
      where: { idnhacungcap: body.id },
      data: {
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai,
        diachi: body.diachi,
        email: body.email,
        trangthai: body.trangthai,
      },
    });

    return NextResponse.json(
      { nhacungcap, message: "Cập nhật nhà cung cấp thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in PUT:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}
