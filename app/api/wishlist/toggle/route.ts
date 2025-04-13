import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idUsers, productId } = await request.json();

    if (
      !idUsers ||
      !productId ||
      isNaN(parseInt(idUsers)) ||
      isNaN(parseInt(productId))
    ) {
      return NextResponse.json(
        { error: "ID người dùng hoặc sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.yeuthich.findFirst({
      where: {
        idUsers: parseInt(idUsers),
        idSanpham: parseInt(productId),
      },
    });

    if (existingFavorite) {
      // Remove if exists
      await prisma.yeuthich.delete({
        where: {
          idYeuthich: existingFavorite.idYeuthich,
        },
      });

      const newCount = await prisma.yeuthich.count({
        where: {
          idSanpham: parseInt(productId),
        },
      });

      return NextResponse.json({
        isFavorite: false,
        count: newCount,
        message: "Đã xóa khỏi danh sách yêu thích",
      });
    } else {
      // Add if not exists
      await prisma.yeuthich.create({
        data: {
          idUsers: parseInt(idUsers),
          idSanpham: parseInt(productId),
        },
      });

      const newCount = await prisma.yeuthich.count({
        where: {
          idSanpham: parseInt(productId),
        },
      });

      return NextResponse.json({
        isFavorite: true,
        count: newCount,
        message: "Đã thêm vào danh sách yêu thích",
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật trạng thái yêu thích" },
      { status: 500 }
    );
  }
}
