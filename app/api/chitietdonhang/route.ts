import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse dữ liệu từ request body
    const body = await request.json();
    const { iddonhang, idsanpham, soluong, dongia } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!iddonhang || !idsanpham || !soluong || !dongia) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết để tạo chi tiết đơn hàng." },
        { status: 400 }
      );
    }

    // Lấy thông tin sản phẩm liên quan (bao gồm `size`)
    const product = await prisma.sanpham.findUnique({
      where: { idsanpham },
      select: { size: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại." },
        { status: 404 }
      );
    }

    // Tạo mới chi tiết đơn hàng
    const newChitietDonhang = await prisma.chitietDonhang.create({
      data: {
        iddonhang,
        idsanpham,
        soluong,
        dongia,
      },
    });

    // Trả về chi tiết đơn hàng kèm thông tin size
    return NextResponse.json(
      {
        ...newChitietDonhang,
        size: product.size, // Thêm thông tin size từ sản phẩm
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ChitietDonhang:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo chi tiết đơn hàng." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    const chitietdonhang = await prisma.chitietDonhang.findMany({
      where: {
        donhang: {
          idUsers: session.idUsers,
        },
      },
      include: {
        sanpham: {
          include: {
            images: true,
            ProductSizes: true,
            ProductColors: true,
          },
        },
        donhang: {
          include: {
            lichgiaohang: {
              select: {
                NgayGiao: true,
                TrangThai: true,
              },
            },
          },
        },
        size: true,
      },
    });

    return NextResponse.json(chitietdonhang);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const idchitietdonhang = await prisma.donhang.deleteMany();
  return NextResponse.json(
    { idchitietdonhang, message: "Xoá tất cả các id" },
    { status: 200 }
  );
}
