import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit_size = Number(searchParams.get("limit_size")) || 10;
    const skip = (page - 1) * limit_size;

    // Get total number of users
    const totalRecords = await prisma.users.count();

    // Get users list with pagination
    const users = await prisma.users.findMany({
      skip,
      take: limit_size,
      orderBy: {
        idUsers: "desc",
      },
      include: {
        role: true, // Include related role information if needed
      },
    });

    // Format response to match the interface
    const formattedData = users.map((item) => ({
      idUsers: item.idUsers,
      Tentaikhoan: item.Tentaikhoan,
      Hoten: item.Hoten,
      Sdt: item.Sdt,
      Diachi: item.Diachi,
      Email: item.Email,
      idRole: item.idRole,
      Ngaydangky: item.Ngaydangky,
      role: item.role,
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
    console.error("Error in GET /api/user", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
