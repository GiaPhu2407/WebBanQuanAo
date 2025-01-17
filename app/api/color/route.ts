// app/api/colors/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      include: {
        ProductColors: {
          include: {
            sanpham: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: colors,
      message: "Lấy danh sách màu thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách màu" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenmau, mamau } = await req.json();

    if (!tenmau || !mamau) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const newColor = await prisma.color.create({
      data: {
        tenmau,
        mamau,
      },
    });

    return NextResponse.json(
      {
        data: newColor,
        message: "Thêm màu thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
