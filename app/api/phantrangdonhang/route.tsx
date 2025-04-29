import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit_size = parseInt(searchParams.get("limit_size") || "10");
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit_size;

    const whereClause = userId ? { idUsers: parseInt(userId) } : {};

    const [donhangs, total] = await Promise.all([
      prisma.donhang.findMany({
        where: whereClause,
        skip,
        take: limit_size,
        include: {
          chitietdonhang: {
            include: {
              sanpham: {
                select: {
                  idsanpham: true,
                  tensanpham: true,
                  gia: true,
                  hinhanh: true,
                  gioitinh: true,
                },
              },
              size: true,
            },
          },
          users: {
            select: {
              Hoten: true,
              Email: true,
              Sdt: true,
              Diachi: true, // Thêm thông tin địa chỉ
            },
          },
          lichgiaohang: {
            select: {
              NgayGiao: true,
              TrangThai: true,
            },
          },
        },
        orderBy: {
          iddonhang: "desc",
        },
      }),
      prisma.donhang.count({
        where: whereClause,
      }),
    ]);

    const totalPage = Math.ceil(total / limit_size);

    return NextResponse.json({
      data: donhangs,
      meta: {
        page,
        limit_size,
        totalRecords: total,
        totalPage,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
