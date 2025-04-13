import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ProductSchema } from "@/app/zodschema/route";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  try {
    const {
      tensanpham,
      mota,
      gia,
      idloaisanpham,
      mausac,
      giamgia,
      gioitinh,
      productSizes,
      hinhanh,
      releaseDate,
    } = await req.json();

    if (!tensanpham || !gia || !idloaisanpham || !productSizes) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const formattedSizes = Object.entries(productSizes).map(
      ([idSize, soluong]) => ({
        idSize: Number(idSize),
        soluong: Number(soluong),
      })
    );

    // Convert releaseDate to UTC
    const utcReleaseDate = releaseDate ? new Date(releaseDate) : null;
    if (utcReleaseDate) {
      utcReleaseDate.setMinutes(
        utcReleaseDate.getMinutes() - utcReleaseDate.getTimezoneOffset()
      );
    }

    const newProduct = await prisma.sanpham.create({
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? Number(giamgia) : null,
        gioitinh,
        hinhanh,
        trangthai: releaseDate ? "SCHEDULED" : "ACTIVE",
        releaseDate: utcReleaseDate,
        ProductSizes: {
          create: formattedSizes,
        },
      },
      include: {
        ProductSizes: true,
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
    console.error("Lỗi khi thêm sản phẩm:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await prisma.sanpham.deleteMany();
    return NextResponse.json({
      message: "Xoá tất cả sản phẩm thành công",
      status: 200,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Lỗi khi xoá sản phẩm: " + e.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get current time in UTC
    const currentDate = new Date();
    currentDate.setMinutes(
      currentDate.getMinutes() - currentDate.getTimezoneOffset()
    );

    const products = await prisma.sanpham.findMany({
      where: {
        OR: [
          { trangthai: "ACTIVE" },
          {
            AND: [
              { trangthai: "SCHEDULED" },
              { releaseDate: { not: null } },
              { releaseDate: { lte: currentDate } },
            ],
          },
        ],
      },
      include: {
        loaisanpham: true,
        ProductSizes: {
          include: {
            size: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}
