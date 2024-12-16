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
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Chuyển đổi ID sang số nguyên
    const idgiohang = parseInt(params.id);

    // Kiểm tra nếu ID không hợp lệ
    if (isNaN(idgiohang)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Xóa item trong giỏ hàng
    const cartItem = await prisma.giohang.delete({
      where: {
        idgiohang, // Đổi thành tên trường viết thường
      },
    });

    // Trả về kết quả thành công
    return NextResponse.json({ cartItem, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
