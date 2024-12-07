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
    const orderId = parseInt(params.id);

    // Find the order with its associated car
    const donHang = await prisma.donhang.findUnique({
      where: { iddonhang: orderId },
      include: { 
        chitietdonhang: {
          select: { idsanpham: true }
        },
        lichgiaohang: true,
        thanhtoan:true,
      }
    });

    // Check if order exists
    if (!donHang) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {

      if (donHang.lichgiaohang.length > 0) {
        await tx.lichGiaoHang.deleteMany({
          where: { iddonhang: orderId }
        });
      }
      
      if (donHang.thanhtoan.length > 0) {
        await tx.thanhtoan.deleteMany({
          where: { iddonhang: orderId }
        });
      }

      // Delete order details first
      await tx.chitietDonhang.deleteMany({
        where: { iddonhang: orderId }
      });

      // Delete the order
      await tx.donhang.delete({
        where: { iddonhang: orderId }
      });

      // Update car status 
      // Note: Assuming there's only one car per order based on your current schema
      if (donHang.chitietdonhang.length > 0) {
        const carId = donHang.chitietdonhang[0].idsanpham;
        
        if (carId) {
          await tx.sanpham.update({
            where: { idsanpham: carId },
            data: { trangthai: "Còn Hàng" }
          });
        }
      }
    });

    return NextResponse.json({ message: "Xóa đơn hàng thành công" });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      error: error.message || "Không thể xóa đơn hàng" 
    }, { status: 500 });
  }
}