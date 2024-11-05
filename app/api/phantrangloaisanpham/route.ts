import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit_size = Number(searchParams.get("limit_size")) || 10;
    const skip = (page - 1) * limit_size;

    // Lấy tổng số bản ghi
    const totalRecords = await prisma.loaisanpham.count();

    // Lấy danh sách loại sản phẩm
    const loaiSanPhams = await prisma.loaisanpham.findMany({
      skip,
      take: limit_size,
      orderBy: {
        idloaisanpham: "desc",
      },
    });

    // Format response để match với interface
    const formattedData = loaiSanPhams.map((item) => ({
      idloaisanpham: item.idloaisanpham,
      tenloai: item.tenloai,
      mota: item.mota,
    }));

    const totalPages = Math.ceil(totalRecords / limit_size);
    return NextResponse.json({
      data: formattedData,
      meta: {
        page,
        limit_size,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/loaisanpham:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
