import prisma from "@/prisma/client"; // Adjust the import based on your project structure
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.idnhacungcap) {
      return NextResponse.json(
        { error: "ID nhà cung cấp không được cung cấp" },
        { status: 400 }
      );
    }

    // Check if the supplier exists
    const supplier = await prisma.nhacungcap.findUnique({
      where: { idnhacungcap: body.idnhacungcap },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Nhà cung cấp không tồn tại" },
        { status: 404 }
      );
    }

    // Create a new Nhaphang record
    const nhaphang = await prisma.nhaphang.create({
      data: {
        ngaynhap: body.ngaynhap,
        tongtien: body.tongtien,
        tongsoluong: body.tongsoluong,
        idnhacungcap: body.idnhacungcap,
      },
    });

    return NextResponse.json(
      { nhaphang, message: "Nhập hàng thành công" },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error in POST Nhaphang:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}
