import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
        trangthai: body.trangthai,
        tongsotien: parseFloat(body.tongsotien),
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const idgiohang = parseInt(params.id); // Đổi tên biến thành idgiohang đúng với field trong schema Prisma
    const cartItem = await prisma.giohang.delete({
      where: {
        idgiohang: idgiohang, // Sử dụng biến idgiohang
      },
    });
    return NextResponse.json({ cartItem, message: "Item deleted" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
