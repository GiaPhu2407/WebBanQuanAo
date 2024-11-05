import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.idnhaphang) {
      return NextResponse.json(
        { error: "ID nhập hàng không được cung cấp" },
        { status: 400 }
      );
    }

    if (!body.idsanpham) {
      return NextResponse.json(
        { error: "ID sản phẩm không được cung cấp" },
        { status: 400 }
      );
    }

    if (!body.soluong || !body.dongia) {
      return NextResponse.json(
        { error: "Số lượng và đơn giá không được để trống" },
        { status: 400 }
      );
    }

    // Check if nhaphang exists
    const nhaphang = await prisma.nhaphang.findUnique({
      where: { idnhaphang: body.idnhaphang },
    });

    if (!nhaphang) {
      return NextResponse.json(
        { error: "Phiếu nhập hàng không tồn tại" },
        { status: 404 }
      );
    }

    // Check if sanpham exists
    const sanpham = await prisma.sanpham.findUnique({
      where: { idsanpham: body.idsanpham },
    });

    if (!sanpham) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    // Create new Chitietnhap record
    const chitietnhap = await prisma.chitietnhap.create({
      data: {
        idnhaphang: body.idnhaphang,
        idsanpham: body.idsanpham,
        soluong: body.soluong, // Chuyển thành chuỗi
        dongia: body.dongia,
      },
    });

    return NextResponse.json(
      { chitietnhap, message: "Thêm chi tiết nhập hàng thành công" },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error in POST Chitietnhap:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  const chitietnhap = await prisma.chitietnhap.findMany();
  return NextResponse.json(
    { chitietnhap, message: "Liệt kê tất cả các chi tiết nhập" },
    { status: 200 }
  );
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const chitietnhap = await prisma.chitietnhap.deleteMany();
  return NextResponse.json(
    { chitietnhap, message: "Đã xoá tất cả các chi tiết nhập" },
    { status: 200 }
  );
}
