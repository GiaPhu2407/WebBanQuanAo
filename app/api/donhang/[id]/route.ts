import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const DonHangSchema = z.object({
    iddonhang: z.number(),
    tongsoluong: z.number().optional(),
    trangthai: z.string().optional(),
    tongsotien: z.number().optional(),
    ngaydat: z.string().optional(),
  });

  const validation = DonHangSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  // Kiểm tra xem đơn hàng có tồn tại không
  const existingDonHang = await prisma.donhang.findUnique({
    where: { iddonhang: body.iddonhang },
  });

  if (!existingDonHang) {
    return NextResponse.json(
      { message: "Đơn hàng không tồn tại" },
      { status: 404 }
    );
  }

  // Cập nhật đơn hàng
  const updatedDonHang = await prisma.donhang.update({
    where: { iddonhang: body.iddonhang },
    data: {
      tongsoluong: body.tongsoluong,
      trangthai: body.trangthai,
      tongsotien: body.tongsotien,
      ngaydat: body.ngaydat,
    },
  });

  return NextResponse.json(
    { message: "Cập nhật đơn hàng thành công", updatedDonHang },
    { status: 200 }
  );
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const iddonhang = parseInt(searchParams.get("iddonhang") || "");

  // Kiểm tra iddonhang hợp lệ
  if (isNaN(iddonhang)) {
    return NextResponse.json(
      { message: "ID đơn hàng không hợp lệ" },
      { status: 400 }
    );
  }

  // Lấy thông tin đơn hàng theo id
  const donhang = await prisma.donhang.findUnique({
    where: { iddonhang },
    include: {
      chitietdonhang: {
        include: {
          sanpham: {
            select: {
              tensanpham: true,
              gioitinh: true,
              mota: true,
              idsanpham:true,
              hinhanh:true,
              images: {
                select: {
                  idImage: true,
                  idSanpham: true,
                  url: true,
                },
              },
            },
          },
        },
      },
      thanhtoan: true,
    },
  });
  if (!donhang) {
    return NextResponse.json(
      { message: "Đơn hàng không tồn tại" },
      { status: 404 }
    );
  }

  return NextResponse.json(donhang, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const iddonhang = parseInt(params.id, 10);

  if (isNaN(iddonhang)) {
    return NextResponse.json(
      { message: "ID đơn hàng không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const existingDonHang = await prisma.donhang.findUnique({
      where: { iddonhang },
    });

    if (!existingDonHang) {
      return NextResponse.json(
        { message: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    await prisma.donhang.delete({ where: { iddonhang } });

    return NextResponse.json(
      { message: "Đơn hàng đã được xóa" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi xóa đơn hàng" },
      { status: 500 }
    );
  }
}