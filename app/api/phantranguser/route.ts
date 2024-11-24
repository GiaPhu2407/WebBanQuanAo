import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Default to page 1 if not specified
    const page: number = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit_size: number = searchParams.get("limit_size")
      ? Number(searchParams.get("limit_size"))
      : 10;

    const skip = (page - 1) * limit_size;

    // Get total record count for pagination
    const totalRecords = await prisma.users.count();
    const totalPage = Math.ceil(totalRecords / limit_size);

    // Fetch paginated data
    const data = await prisma.users.findMany({
      skip: skip,
      take: limit_size,
      include: {
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data,
        meta: {
          totalRecords,
          totalPage,
          page,
          limit_size,
          skip,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
