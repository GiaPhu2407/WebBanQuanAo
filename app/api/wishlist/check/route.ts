// File: app/api/wishlist/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Check if a user has favorited a product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    const favorite = await prisma.yeuthich.findFirst({
      where: {
        idUsers: parseInt(userId),
        idSanpham: parseInt(productId),
      },
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      { error: "Failed to check favorite status" },
      { status: 500 }
    );
  }
}
