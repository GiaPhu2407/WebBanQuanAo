import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const favorites = await prisma.yeuthich.findMany({
      where: {
        idUsers: parseInt(userId),
      },
      include: {
        sanpham: {
          include: {
            ProductColors: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch user favorites" },
      { status: 500 }
    );
  }
}
