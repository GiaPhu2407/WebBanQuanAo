import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client"; // Ensure this path matches your project structure
import { SupplierSchema } from "@/app/zodschema/route";
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Update the supplier
    const nhacungcap = await prisma.nhacungcap.update({
      where: {
        idnhacungcap: parseInt(id),
      },
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
