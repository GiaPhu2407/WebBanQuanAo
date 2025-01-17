import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

// GET tất cả sản phẩm
export async function GET() {
  try {
    const products = await prisma.sanpham.findMany({
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

    return NextResponse.json({
      data: products,
      message: "Lấy danh sách sản phẩm thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// GET sản phẩm theo ID

// POST tạo sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const {
      tensanpham,
      mota,
      gia,
      idloaisanpham,
      productColors,
      giamgia,
      gioitinh,
      productSizes,
      hinhanh,
    } = await req.json();

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

    // Create new product
    const newProduct = await prisma.sanpham.create({
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? new Decimal(giamgia) : null,
        gioitinh,
        hinhanh,
        ProductSizes: {
          create: formattedSizes,
        },
        ProductColors: {
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

    return NextResponse.json(
      {
        data: newProduct,
        message: "Thêm sản phẩm thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
