import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const sanpham = await prisma.sanpham.create({
      data: {
        tensanpham: body.tensanpham,
        mota: body.mota,
        gia: body.gia,
        hinhanh: body.hinhanh,
        idloaisanpham: body.idloaisanpham,
        giamgia: body.giamgia,
        gioitinh: body.gioitinh === "nam" ? true : false, // Chuyển đổi chuỗi thành boolean
      },
    });
    return NextResponse.json(
      { sanpham, message: "Thêm mới thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sanpham = await prisma.sanpham.findMany();
  return NextResponse.json(sanpham);
}
