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
                  },
                },
              },
            },
          },
        },
        users: {
          select: {
            Hoten: true,
            Email: true,
            Sdt: true,
          },
        },
        discount: {
          select: {
            code: true,
            discountType: true,
            value: true,
            description: true,
          },
        },
        lichgiaohang: {
          select: {
            NgayGiao: true,
            TrangThai: true,
          },
        },
        thanhtoan: true,
      },
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

    const updateData: any = {
      trangthai: body.TrangThaiDonHang,
    };

    // Nếu có TongTien, cập nhật nó
    if (body.TongTien) {
      updateData.tongsotien = parseFloat(body.TongTien);
    }

    // Cập nhật mã giảm giá nếu có
    if (body.discountCode) {
      // Tìm mã giảm giá
      const discount = await prisma.discountCode.findFirst({
        where: {
          code: body.discountCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (discount) {
        // Kiểm tra giới hạn sử dụng
        if (
          discount.usageLimit !== null &&
          discount.usedCount >= discount.usageLimit
        ) {
          return NextResponse.json(
            { error: "Mã giảm giá đã đạt giới hạn sử dụng." },
            { status: 400 }
          );
        }

        // Lấy đơn hàng hiện tại để biết giá trị đơn hàng gốc
        const currentOrder = await prisma.donhang.findUnique({
          where: { iddonhang: idDonHang },
        });

        if (!currentOrder) {
          return NextResponse.json(
            { error: "Không tìm thấy đơn hàng" },
            { status: 404 }
          );
        }

        // Tính tổng tiền gốc (bỏ qua giảm giá hiện tại nếu có)
        let originalTotal: number = Number(currentOrder.tongsotien || 0);
        if (currentOrder.discountValue) {
          originalTotal =
            originalTotal + Number(currentOrder.discountValue || 0);
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (
          discount.minOrderValue &&
          originalTotal < Number(discount.minOrderValue)
        ) {
          return NextResponse.json(
            {
              error: `Giá trị đơn hàng phải tối thiểu ${discount.minOrderValue} để sử dụng mã giảm giá này.`,
            },
            { status: 400 }
          );
        }

        // Tính giá trị giảm giá
        let discountValue = 0;
        if (discount.discountType === "PERCENTAGE") {
          discountValue = (originalTotal * Number(discount.value)) / 100;
          if (
            discount.maxDiscount &&
            discountValue > Number(discount.maxDiscount)
          ) {
            discountValue = Number(discount.maxDiscount);
          }
        } else {
          discountValue = Number(discount.value);
        }

        updateData.idDiscount = discount.idDiscount;
        updateData.discountValue = discountValue;
        updateData.tongsotien = originalTotal - discountValue;

        // Cập nhật số lần sử dụng của mã giảm giá
        await prisma.discountCode.update({
          where: { idDiscount: discount.idDiscount },
          data: { usedCount: { increment: 1 } },
        });
      } else {
        return NextResponse.json(
          { error: "Mã giảm giá không hợp lệ hoặc đã hết hạn." },
          { status: 400 }
        );
      }
    } else if (body.removeDiscount === true) {
      // Xóa áp dụng mã giảm giá
      const currentOrder = await prisma.donhang.findUnique({
        where: { iddonhang: idDonHang },
        select: {
          tongsotien: true,
          discountValue: true,
          idDiscount: true,
        },
      });

      if (currentOrder && currentOrder.discountValue) {
        // Khôi phục giá gốc
        updateData.tongsotien =
          Number(currentOrder.tongsotien || 0) +
          Number(currentOrder.discountValue || 0);
        updateData.idDiscount = null;
        updateData.discountValue = null;
      }
    }

    const putDonHang = await prisma.donhang.update({
      where: { iddonhang: idDonHang },
      data: updateData,
    });

    return NextResponse.json({
      putDonHang,
      message: "Cập nhật đơn hàng thành công",
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: error.message, stack: error.stack });
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
