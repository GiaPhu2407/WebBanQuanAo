import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.idYeuthich || !body.idUsers || !body.idSanpham) {
      return NextResponse.json(
        { error: "ID yêu thích, ID người dùng và ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if the favorite record exists
    const existingFavorite = await prisma.yeuthich.findUnique({
      where: {
        idYeuthich: body.idYeuthich,
      },
    });

    if (!existingFavorite) {
      return NextResponse.json(
        { error: "Bản ghi yêu thích không tồn tại" },
        { status: 404 }
      );
    }

    // Update the favorite record
    const updatedFavorite = await prisma.yeuthich.update({
      where: { idYeuthich: body.idYeuthich },
      data: {
        idUsers: body.idUsers,
        idSanpham: body.idSanpham,
      },
    });

    return NextResponse.json(
      { updatedFavorite, message: "Cập nhật danh sách yêu thích thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT Yeuthich:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + error.message },
      { status: 500 }
    );
  }
}
