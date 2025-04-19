import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // If page parameter isn't in URL, default to 1
    const page: number = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit_size: number = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10;
    const search = searchParams.get("search") || "";
    const rating = searchParams.get("rating");
    const skip = (page - 1) * limit_size;

    // Build where clause
    let whereClause: any = {};

    // Add search filter if provided (search by user name or product name)
    if (search) {
      whereClause = {
        OR: [
          {
            users: {
              OR: [
                { Tentaikhoan: { contains: search } },
                { Hoten: { contains: search } },
              ],
            },
          },
          {
            sanpham: {
              tensanpham: { contains: search },
            },
          },
          {
            noidung: { contains: search },
          },
        ],
      };
    }

    // Add rating filter if provided
    if (rating && rating !== "all") {
      whereClause.sao = parseInt(rating);
    }

    // Get total records with applied filters
    const totalRecords = await prisma.danhgia.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalRecords / limit_size);

    // Fetch reviews with included relationships
    const evaluates = await prisma.danhgia.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            Tentaikhoan: true,
            Hoten: true,
          },
        },
        sanpham: {
          select: {
            idsanpham: true,
            tensanpham: true,
            hinhanh: true, // Include product image
          },
        },
      },
      orderBy: {
        ngaydanhgia: "desc", // Most recent reviews first
      },
      skip: skip,
      take: limit_size,
    });

    return NextResponse.json(
      {
        evaluates,
        meta: {
          totalRecords,
          totalPages,
          page,
          limit_size,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching paginated reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch review data" },
      { status: 500 }
    );
  }
}
