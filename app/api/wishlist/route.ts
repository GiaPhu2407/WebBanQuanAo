import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Get all favorites for a user
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
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// Add a product to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.yeuthich.findFirst({
      where: {
        idUsers: parseInt(userId),
        idSanpham: parseInt(productId),
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Product already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.yeuthich.create({
      data: {
        idUsers: parseInt(userId),
        idSanpham: parseInt(productId),
      },
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// Remove from favorites
export async function DELETE(request: NextRequest) {
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

    await prisma.yeuthich.deleteMany({
      where: {
        idUsers: parseInt(userId),
        idSanpham: parseInt(productId),
      },
    });

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
