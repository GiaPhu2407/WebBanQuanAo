// app/api/product-colors/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const productColors = await prisma.productColor.findMany({
      include: {
        sanpham: true,
        color: true,
      },
    });

    return NextResponse.json({
      data: productColors,
      message: "Lấy danh sách màu sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách màu sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { idsanpham, idmausac, hinhanh } = await req.json();

    if (!idsanpham || !idmausac) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const newProductColor = await prisma.productColor.create({
      data: {
        idsanpham: Number(idsanpham),
        idmausac: Number(idmausac),
        hinhanh,
      },
      include: {
        sanpham: true,
        color: true,
      },
    });

    return NextResponse.json(
      {
        data: newProductColor,
        message: "Thêm màu cho sản phẩm thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
