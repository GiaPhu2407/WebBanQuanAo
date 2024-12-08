import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, {params}:{params: {id: string}}){
        try {
            const body = await req.json();
            const idDonHang = parseInt(params.id);
            const putDonHang = await prisma.donhang.update({
                where: {iddonhang: idDonHang},
                data: {
                    trangthai: body.trangthai,
                    tongsotien: parseFloat(body.tongsotien),
                },
                
            })
            return NextResponse.json({putDonHang, message:"Cập nhật đơn hàng thành công"})
        } catch (error: any) {
            return NextResponse.json({error: error.message})
        }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Chuyển đổi id từ params sang số nguyên
    const orderId = parseInt(params.id);

    // Kiểm tra nếu `params.id` không hợp lệ
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    // Lấy thông tin đơn hàng và các dữ liệu liên quan
    const donHang = await prisma.donhang.findUnique({
      where: { iddonhang: orderId },
      include: {
        chitietdonhang: {
          select: { idsanpham: true },
        },
        lichgiaohang: true,
        thanhtoan: true,
      },
    });

    // Nếu đơn hàng không tồn tại
    if (!donHang) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Bắt đầu giao dịch để đảm bảo tính toàn vẹn dữ liệu
    await prisma.$transaction(async (tx) => {
      // Xóa dữ liệu liên quan trong bảng `lichgiaohang` nếu có
      if (donHang.lichgiaohang.length > 0) {
        console.log("Đang xóa lịch giao hàng...");
        await tx.lichGiaoHang.deleteMany({
          where: { iddonhang: orderId },
        });
      }

      // Xóa dữ liệu liên quan trong bảng `thanhtoan` nếu có
      if (donHang.thanhtoan.length > 0) {
        console.log("Đang xóa thông tin thanh toán...");
        await tx.thanhtoan.deleteMany({
          where: { iddonhang: orderId },
        });
      }

      // Xử lý trạng thái sản phẩm trong `chitietdonhang`
      if (donHang.chitietdonhang.length > 0) {
        for (const chiTiet of donHang.chitietdonhang) {
          const carId = chiTiet.idsanpham;

          // Kiểm tra nếu `idsanpham` hợp lệ
          if (!carId) {
            console.warn("ID sản phẩm không hợp lệ:", carId);
            continue; // Bỏ qua sản phẩm không hợp lệ
          }

          console.log(`Cập nhật trạng thái sản phẩm ID: ${carId}`);
          await tx.sanpham.update({
            where: { idsanpham: carId },
            data: { trangthai: "Còn Hàng" }, // Cập nhật trạng thái sản phẩm
          });
        }
      }

      // Xóa dữ liệu trong bảng `chitietdonhang`
      console.log("Đang xóa chi tiết đơn hàng...");
      await tx.chitietDonhang.deleteMany({
        where: { iddonhang: orderId },
      });

      // Xóa đơn hàng trong bảng `donhang`
      console.log("Đang xóa đơn hàng...");
      await tx.donhang.delete({
        where: { iddonhang: orderId },
      });
    });

    // Trả về phản hồi thành công
    return NextResponse.json({ message: "Xóa đơn hàng thành công" });
  } catch (error: any) {
    // Xử lý lỗi và trả về thông báo lỗi
    console.error("Lỗi khi xóa đơn hàng:", error);
    return NextResponse.json(
      { error: error.message || "Không thể xóa đơn hàng" },
      { status: 500 }
    );
  }
}
