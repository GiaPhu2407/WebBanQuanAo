import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ProductSchema } from "@/app/zodschema/route";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // Validate input data
    const validationResult = ProductSchema.safeParse({
      tensanpham: body.tensanpham,
      mota: body.mota,
      gia: body.gia,
      hinhanh: body.hinhanh,
      idloaisanpham: parseInt(body.idloaisanpham),
      giamgia: parseFloat(body.giamgia),
      gioitinh: body.gioitinh === "nam" ? true : false,
      size: body.size,
    });

    // Check if loai xe exists
    const loaisanpham = await prisma.loaisanpham.findUnique({
      where: {
        idloaisanpham: parseInt(body.idloaisanpham),
      },
    });

    if (!loaisanpham) {
      return NextResponse.json(
        {
          message: "Loại sản phẩm không tồn tại",
          code: "invalid_loai_san_pham",
        },
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: validationResult.error },
        { status: 400 }
      );
    }

    // Get the highest existing ID
    const maxIdResult = await prisma.sanpham.findFirst({
      orderBy: {
        idsanpham: "desc",
      },
      select: {
        idsanpham: true,
      },
    });

    // Calculate the next ID (start from 1 if no records exist)
    const nextId = maxIdResult ? maxIdResult.idsanpham + 1 : 1;

    // Create new product with calculated ID
    const sanpham = await prisma.sanpham.create({
      data: {
        idsanpham: nextId,
        tensanpham: body.tensanpham,
        mota: body.mota,
        gia: body.gia,
        hinhanh: body.hinhanh,
        idloaisanpham: parseInt(body.idloaisanpham),
        giamgia: parseFloat(body.giamgia),
        gioitinh: body.gioitinh === "nam" ? true : false,
        size: body.size,
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
  try {
    // Get all products ordered by ID
    const sanpham = await prisma.sanpham.findMany({
      orderBy: {
        idsanpham: "asc",
      },
    });
    return NextResponse.json(sanpham);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get ID from request URL
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "ID sản phẩm không được cung cấp",
        status: 400,
      });
    }

    // Delete specific product
    const deletedProduct = await prisma.sanpham.delete({
      where: {
        idsanpham: parseInt(id),
      },
    });

    // Get all remaining products
    const remainingProducts = await prisma.sanpham.findMany({
      orderBy: {
        idsanpham: "asc",
      },
    });

    // Update IDs to be sequential
    for (let i = 0; i < remainingProducts.length; i++) {
      await prisma.sanpham.update({
        where: {
          idsanpham: remainingProducts[i].idsanpham,
        },
        data: {
          idsanpham: i + 1,
        },
      });
    }

    return NextResponse.json({
      message: "Xoá thành công và cập nhật ID",
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
