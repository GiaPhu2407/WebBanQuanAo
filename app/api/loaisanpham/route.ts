import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const loaiSanPham = await prisma.loaisanpham.findMany();
  return NextResponse.json(loaiSanPham);
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenloai, mota } = body;

    // Tạo mới loại sản phẩm
    const newLoaisanpham = await prisma.loaisanpham.create({
      data: {
        tenloai,
        mota,
      },
    });

    return NextResponse.json(newLoaisanpham, { status: 201 });
  } catch (error) {
    console.error("Error creating Loaisanpham:", error);
    return NextResponse.json(
      { error: "Error creating Loaisanpham" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const loaiSanpham = await prisma.loaisanpham.deleteMany();
  return NextResponse.json({
    loaiSanpham,
    message: "Xoá thành công",
    status: 200,
  });
}
