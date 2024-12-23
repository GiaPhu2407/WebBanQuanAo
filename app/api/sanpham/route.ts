import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ProductSchema } from "@/app/zodschema/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const validationResult = ProductSchema.safeParse({
      tensanpham: body.tensanpham,
      mota: body.mota,
      gia: body.gia,
      hinhanh: body.hinhanh,
      mausac:body.mausac,
      idloaisanpham: parseInt(body.idloaisanpham),
      giamgia: parseFloat(body.giamgia),
     
      // Directly take gioitinh as a boolean
      gioitinh: body.gioitinh === true, // Ensure this is evaluated as boolean
      size: body.size,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: validationResult.error },
        { status: 400 }
      );
    }

    // Check if loaisanpham exists
    const loaisanpham = await prisma.loaisanpham.findUnique({
      where: { idloaisanpham: parseInt(body.idloaisanpham) },
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

    // Get the highest existing ID and calculate the next ID
    const maxIdResult = await prisma.sanpham.findFirst({
      orderBy: { idsanpham: "desc" },
      select: { idsanpham: true },
    });
    const nextId = maxIdResult ? maxIdResult.idsanpham + 1 : 1;

    // Create new product
    const sanpham = await prisma.sanpham.create({
      data: {
        idsanpham: nextId,
        tensanpham: body.tensanpham,
        mota: body.mota,
        gia: body.gia,
        hinhanh: body.hinhanh,
        mausac:body.mausac,
        idloaisanpham: parseInt(body.idloaisanpham),
        giamgia: parseFloat(body.giamgia),
        gioitinh: body.gioitinh, // This should already be a boolean
        size: body.size,
      },
    });

    return NextResponse.json(
      { sanpham, message: "Thêm mới thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in POST:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
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
    // Delete all products
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
