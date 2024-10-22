import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const idloaisanpham = parseInt(params.id);

  try {
    const xe = await prisma.sanpham.findMany({
      where: {
        idloaisanpham: idloaisanpham,
      },
      include: {
        loaisanpham: true,
      },
    });

    return NextResponse.json(xe);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách sản phẩm' }, { status: 500 });
  }
}