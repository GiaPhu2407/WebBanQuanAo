import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const {
      tensanpham,
      mota,
      gia,
      idloaisanpham,
      productColors,
      giamgia,
      gioitinh,
      trangthai,
      productSizes,
      hinhanh,
    } = await request.json();

    // Validation
    if (
      !tensanpham ||
      !gia ||
      !idloaisanpham ||
      !productSizes ||
      !productColors
    ) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Format sizes
    const formattedSizes = Object.entries(productSizes).map(
      ([idSize, soluong]) => ({
        idSize: Number(idSize),
        soluong: Number(soluong),
      })
    );

    // Format colors
    const formattedColors = productColors.map((color: any) => ({
      idmausac: Number(color.idmausac),
      hinhanh: color.hinhanh,
    }));

    // Update product
    const updatedProduct = await prisma.sanpham.update({
      where: { idsanpham: Number(id) },
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? new Decimal(giamgia) : null,
        gioitinh,
        trangthai,
        hinhanh,
        ProductSizes: {
          deleteMany: {},
          create: formattedSizes,
        },
        ProductColors: {
          deleteMany: {},
          create: formattedColors,
        },
      },
      include: {
        ProductSizes: {
          include: {
            size: true,
          },
        },
        ProductColors: {
          include: {
            color: true,
          },
        },
        loaisanpham: true,
      },
    });

    return NextResponse.json({
      data: updatedProduct,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE sản phẩm theo ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Delete related records first
    await prisma.productColor.deleteMany({
      where: { idsanpham: Number(id) },
    });

    await prisma.productSize.deleteMany({
      where: { idsanpham: Number(id) },
    });

    // Then delete the product
    const deletedProduct = await prisma.sanpham.delete({
      where: { idsanpham: Number(id) },
    });

    return NextResponse.json({
      data: deletedProduct,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const product = await prisma.sanpham.findUnique({
      where: {
        idsanpham: Number(id),
      },
      include: {
        loaisanpham: true,
        ProductSizes: {
          include: {
            size: true,
          },
        },
        ProductColors: {
          include: {
            color: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: product,
      message: "Lấy thông tin sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
