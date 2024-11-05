import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit_size = Number(searchParams.get("limit_size")) || 10;
    const skip = (page - 1) * limit_size;

    // Get total number of suppliers
    const totalRecords = await prisma.nhacungcap.count();

    // Get suppliers list with pagination
    const nhaCungCaps = await prisma.nhacungcap.findMany({
      skip,
      take: limit_size,
      orderBy: {
        idnhacungcap: "desc",
      },
    });

    // Format response to match the interface from your React component
    const formattedData = nhaCungCaps.map((item) => ({
      idnhacungcap: item.idnhacungcap,
      tennhacungcap: item.tennhacungcap,
      sodienthoai: item.sodienthoai,
      diachi: item.diachi,
      email: item.email,
      trangthai: item.trangthai,
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
    console.error("Error in GET /api/nhacungcap:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
