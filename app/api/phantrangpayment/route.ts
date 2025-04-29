import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Nếu trên URL không có search page param thì gán bằng 1
    const page: number = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const pageSize: number = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 10;

    const skip = (page - 1) * pageSize;

    // Tính tổng số bản ghi
    const totalRecords = await prisma.thanhtoan.count();
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Lấy dữ liệu thanh toán với thông tin đơn hàng
    const payments = await prisma.thanhtoan.findMany({
      skip: skip,
      take: pageSize,
      orderBy: {
        idthanhtoan: "desc",
      },
      include: {
        donhang: {
          select: {
            iddonhang: true,
            tongsotien: true,
            trangthai: true,
            users: {
              select: {
                idUsers: true,
                Email: true,
                Hoten: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: payments,
        meta: {
          totalRecords,
          totalPages,
          page,
          pageSize,
          skip,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment data" },
      { status: 500 }
    );
  }
}
