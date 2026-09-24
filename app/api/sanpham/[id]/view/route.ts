import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// POST /api/sanpham/[id]/view — tăng lượt xem +1
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const idsanpham = parseInt(params.id);

    if (isNaN(idsanpham)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Tăng totalViews lên 1 bằng increment
    const updated = await prisma.sanpham.update({
      where: { idsanpham },
      data: {
        totalViews: { increment: 1 },
      },
      select: { idsanpham: true, totalViews: true },
    });

    return NextResponse.json(
      { success: true, totalViews: updated.totalViews },
      { status: 200 },
    );
  } catch (error: any) {
    // Nếu sản phẩm không tồn tại, Prisma sẽ throw lỗi P2025
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 },
      );
    }
    console.error("[View API] Error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
