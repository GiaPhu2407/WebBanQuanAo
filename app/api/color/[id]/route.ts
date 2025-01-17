// app/api/colors/[id]/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const color = await prisma.color.findUnique({
      where: {
        idmausac: Number(id),
      },
      include: {
        ProductColors: {
          include: {
            sanpham: true,
          },
        },
      },
    });

    if (!color) {
      return NextResponse.json(
        { message: "Không tìm thấy màu" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: color,
      message: "Lấy thông tin màu thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { tenmau, mamau } = await request.json();

    if (!tenmau || !mamau) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const updatedColor = await prisma.color.update({
      where: { idmausac: Number(id) },
      data: {
        tenmau,
        mamau,
      },
    });

    return NextResponse.json({
      data: updatedColor,
      message: "Cập nhật màu thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Xóa tất cả ProductColors liên quan
    await prisma.productColor.deleteMany({
      where: { idmausac: Number(id) },
    });

    // Sau đó xóa màu
    const deletedColor = await prisma.color.delete({
      where: { idmausac: Number(id) },
    });

    return NextResponse.json({
      data: deletedColor,
      message: "Xóa màu thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
