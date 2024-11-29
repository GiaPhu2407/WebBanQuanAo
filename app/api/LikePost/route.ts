import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// API POST: Thêm sản phẩm vào danh sách yêu thích
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.idUsers || !body.idSanpham) {
      return NextResponse.json(
        { error: "ID người dùng và ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Check if the product is already in the user's favorites
    const existingFavorite = await prisma.yeuthich.findFirst({
      where: {
        idUsers: body.idUsers,
        idSanpham: body.idSanpham,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Sản phẩm đã có trong danh sách yêu thích" },
        { status: 200 }
      );
    }

    // Create a new favorite record
    const yeuthich = await prisma.yeuthich.create({
      data: {
        idUsers: body.idUsers,
        idSanpham: body.idSanpham,
      },
    });

    return NextResponse.json(
      { yeuthich, message: "Thêm sản phẩm vào danh sách yêu thích thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST Yeuthich:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + error.message },
      { status: 500 }
    );
  }
}