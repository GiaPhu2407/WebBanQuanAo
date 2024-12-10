import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse dữ liệu từ request body
    const body = await request.json();
    const { idUsers, chitietDonhang, trangthai = "Đang xử lý" } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!idUsers || !chitietDonhang || chitietDonhang.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết để tạo đơn hàng." },
        { status: 400 }
      );
    }

    // Tính tổng số lượng và tổng số tiền từ danh sách chi tiết đơn hàng
    let tongsoluong = 0;
    let tongsotien = 0;

    for (const item of chitietDonhang) {
      const { idsanpham, soluong } = item;

      // Lấy thông tin sản phẩm để tính giá
      const sanpham = await prisma.sanpham.findUnique({
        where: { idsanpham },
        select: { gia: true }, // Giá của sản phẩm
      });

      if (!sanpham) {
        return NextResponse.json(
          { error: `Không tìm thấy sản phẩm với ID: ${idsanpham}` },
          { status: 404 }
        );
      }

      // Tính tổng số lượng và tổng số tiền
      tongsoluong += soluong;
      tongsotien += soluong * Number(sanpham.gia);
    }

    // Tạo mới đơn hàng
    const newDonhang = await prisma.donhang.create({
      data: {
        idUsers,
        tongsoluong,
        tongsotien,
        trangthai,
        ngaydat: new Date().toISOString(),
      },
    });

    // Thêm chi tiết đơn hàng
    const createdChitietDonhang = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        return await prisma.chitietDonhang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            dongia: item.dongia, // Giá có thể lấy từ body hoặc sản phẩm
          },
        });
      })
    );

    // Trả về thông tin đơn hàng và các chi tiết đã thêm
    return NextResponse.json(
      {
        donhang: newDonhang,
        chitietDonhang: createdChitietDonhang,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Donhang:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo đơn hàng." },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
      const session = await getSession();
      const donhang = await prisma.donhang.findMany({
          where:{
              idUsers: session.idUsers
          },
          include: {
              chitietdonhang:{
                  include: {
                      sanpham: {
                          select: {
                              tensanpham: true,
                              gia: true,
                              hinhanh: true,
                              gioitinh: true,
                          }
                      }
                  }
              },
              lichgiaohang:{
                  select: {
                      NgayGiao: true,
                      TrangThai: true,
                  }
              }
          }
      })
      return NextResponse.json(donhang)
  } catch (error: any) {
      return NextResponse.json({ error: error.message})
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const iddonhang = await prisma.donhang.deleteMany();
  return NextResponse.json(
    { iddonhang, message: "Xoá tất cả các id" },
    { status: 200 }
  );
}
