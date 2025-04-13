import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const runtime = "edge";

export async function GET() {
  try {
    const now = new Date();

    // Find all products that should be released
    const productsToRelease = await prisma.sanpham.findMany({
      where: {
        releaseDate: {
          lte: now,
        },
        trangthai: "SCHEDULED",
      },
    });

    // Update products to be visible
    await prisma.sanpham.updateMany({
      where: {
        idsanpham: {
          in: productsToRelease.map((p) => p.idsanpham),
        },
      },
      data: {
        trangthai: "ACTIVE",
        releaseDate: null,
      },
    });

    return NextResponse.json({
      success: true,
      releasedProducts: productsToRelease.length,
    });
  } catch (error) {
    console.error("Error releasing products:", error);
    return NextResponse.json(
      { error: "Failed to release products" },
      { status: 500 }
    );
  }
}
