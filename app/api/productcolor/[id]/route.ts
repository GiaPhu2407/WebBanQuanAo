// app/api/product-colors/[productId]/[colorId]/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; colorId: string } }
) {
  const { productId, colorId } = params;
  try {
    const deletedProductColor = await prisma.productColor.delete({
      where: {
        idsanpham_idmausac: {
          idsanpham: Number(productId),
          idmausac: Number(colorId),
        },
      },
    });

    return NextResponse.json({
      data: deletedProductColor,
      message: "Xóa màu khỏi sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string; colorId: string } }
) {
  const { productId, colorId } = params;
  try {
    const { hinhanh } = await request.json();

    const updatedProductColor = await prisma.productColor.update({
      where: {
        idsanpham_idmausac: {
          idsanpham: Number(productId),
          idmausac: Number(colorId),
        },
      },
      data: {
        hinhanh,
      },
      include: {
        sanpham: true,
        color: true,
      },
    });

    return NextResponse.json({
      data: updatedProductColor,
      message: "Cập nhật màu sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
