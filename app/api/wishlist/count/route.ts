// File: app/api/wishlist/count/[productId]/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const count = await prisma.yeuthich.count({
      where: {
        idSanpham: productId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting favorites:", error);
    return NextResponse.json(
      { error: "Lỗi khi đếm lượt yêu thích" },
      { status: 500 }
    );
  }
}
