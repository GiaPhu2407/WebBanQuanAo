import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const productId = url.searchParams.get("productId");

    if (
      !userId ||
      !productId ||
      isNaN(parseInt(userId)) ||
      isNaN(parseInt(productId))
    ) {
      return NextResponse.json(
        { error: "ID người dùng hoặc sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const favorite = await prisma.yeuthich.findFirst({
      where: {
        idUsers: parseInt(userId),
        idSanpham: parseInt(productId),
      },
    });

    const count = await prisma.yeuthich.count({
      where: {
        idSanpham: parseInt(productId),
      },
    });

    return NextResponse.json({
      isFavorite: !!favorite,
      count,
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      { error: "Lỗi khi kiểm tra trạng thái yêu thích" },
      { status: 500 }
    );
  }
}
