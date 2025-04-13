import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    const favorites = await prisma.yeuthich.findMany({
      where: {
        idUsers: userId,
      },
      include: {
        sanpham: {
          include: {
            ProductColors: true,
          },
        },
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách yêu thích" },
      { status: 500 }
    );
  }
}
