import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const iddonhang = parseInt(params.id);

    if (isNaN(iddonhang)) {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    const donhang = await prisma.donhang.findUnique({
      where: { iddonhang },
      include: {
        chitietdonhang: {
          include: {
            sanpham: {
              select: {
                tensanpham: true,
                gia: true,
                hinhanh: true,
                gioitinh: true,
                mota: true,
                images: {
                  select: {
                    idImage: true,
                    url: true,
                  }
                }
              }
            }
          }
        },
        users: {
          select: {
            Hoten: true,
            Email: true,
            Sdt: true,
          }
        },
        lichgiaohang: {
          select: {
            NgayGiao: true,
            TrangThai: true,
          }
        },
        thanhtoan: true
      }
    });

    if (!donhang) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json(donhang);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy thông tin đơn hàng", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const idDonHang = parseInt(params.id);
    const putDonHang = await prisma.donhang.update({
      where: { iddonhang: idDonHang },
      data: {
        trangthai: body.TrangThaiDonHang,
        tongsotien: parseFloat(body.TongTien),
      },
    });
    return NextResponse.json({
      putDonHang,
      message: "Cập nhật đơn hàng thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
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