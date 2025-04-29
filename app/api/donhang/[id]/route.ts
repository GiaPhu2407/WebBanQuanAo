import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { sendOrderStatusUpdateEmail } from "@/lib/emailOrder";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo params là một đối tượng có sẵn trước khi sử dụng
    if (!params || typeof params.id !== "string") {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    const iddonhang = Number.parseInt(params.id);

    if (isNaN(iddonhang)) {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    // Get session to check authorization
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query based on user role
    const isAdmin = session.role === "Admin";
    const whereClause: any = { iddonhang };

    // If not admin, restrict to user's own orders
    if (!isAdmin) {
      whereClause.idUsers = session.idUsers;
    }

    const donhang = await prisma.donhang.findFirst({
      where: whereClause,
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
            size: true,
          },
        },
        users: {
          select: {
            idUsers: true,
            Hoten: true,
            Email: true,
            Sdt: true,
            Diachi: true,
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
        diaChiGiaoHang: {
          select: {
            idDiaChi: true,
            diaChiChiTiet: true,
            thanhPho: true,
            quanHuyen: true,
            phuongXa: true,
            soDienThoai: true,
            tenNguoiNhan: true,
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

    return NextResponse.json({
      success: true,
      data: donhang,
    });
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
    // Kiểm tra params trước khi sử dụng
    if (!params || typeof params.id !== "string") {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    // Check authorization
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log session để debug
    console.log("Session info:", {
      role: session.role,
      idUsers: session.idUsers,
      isValid: !!session,
    });

    const body = await req.json();
    const idDonHang = Number.parseInt(params.id);

    if (isNaN(idDonHang)) {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    const {
      TrangThaiDonHang,
      idDiaChi,
      TongTien,
      discountCode,
      removeDiscount,
      sendEmail = false,
    } = body;

    // Verify the order exists and user has permission
    const existingOrder = await prisma.donhang.findUnique({
      where: { iddonhang: idDonHang },
      include: {
        users: {
          select: {
            idUsers: true,
            Email: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Check if user has permission (admin or order owner)
    // Đã kiểm tra session !== null ở trên nên an toàn khi truy cập session.role và session.idUsers
    const isAdmin = session.role === "Admin";
    const isOwner = existingOrder.idUsers === session.idUsers;

    // Log permission info để debug
    console.log("Permission check:", {
      isAdmin,
      isOwner,
      sessionUserId: session.idUsers,
      orderUserId: existingOrder.idUsers,
    });

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error: "Không có quyền cập nhật đơn hàng này",
          details: {
            isAdmin,
            isOwner,
            sessionId: session.idUsers,
            orderId: existingOrder.idUsers,
          },
        },
        { status: 403 }
      );
    }

    const updateData: any = {};

    // Update order status if provided
    if (TrangThaiDonHang) {
      updateData.trangthai = TrangThaiDonHang;
    }

    // Update shipping address if provided
    if (idDiaChi) {
      const address = await prisma.diaChi.findUnique({
        where: { idDiaChi },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Địa chỉ giao hàng không tồn tại" },
          { status: 404 }
        );
      }

      updateData.idDiaChi = idDiaChi;
    }

    // Update total amount if provided
    if (TongTien) {
      updateData.tongsotien = Number.parseFloat(TongTien);
    }

    // Handle discount code
    if (discountCode) {
      // Find the discount code
      const discount = await prisma.discountCode.findFirst({
        where: {
          code: discountCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (!discount) {
        return NextResponse.json(
          { error: "Mã giảm giá không hợp lệ hoặc đã hết hạn." },
          { status: 400 }
        );
      }

      // Check usage limit
      if (
        discount.usageLimit !== null &&
        discount.usedCount >= discount.usageLimit
      ) {
        return NextResponse.json(
          { error: "Mã giảm giá đã đạt giới hạn sử dụng." },
          { status: 400 }
        );
      }

      // Calculate original total (removing any existing discount)
      let originalTotal: number = Number(existingOrder.tongsotien || 0);
      if (existingOrder.discountValue) {
        originalTotal += Number(existingOrder.discountValue || 0);
      }

      // Check minimum order value
      if (
        discount.minOrderValue &&
        originalTotal < Number(discount.minOrderValue)
      ) {
        return NextResponse.json(
          {
            error: `Giá trị đơn hàng phải tối thiểu ${formatCurrency(
              Number(discount.minOrderValue)
            )} để sử dụng mã giảm giá này.`,
          },
          { status: 400 }
        );
      }

      // Calculate discount value
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
      updateData.tongsotien = Math.max(0, originalTotal - discountValue);

      // Update discount usage count
      await prisma.discountCode.update({
        where: { idDiscount: discount.idDiscount },
        data: { usedCount: { increment: 1 } },
      });
    } else if (removeDiscount === true) {
      // Remove discount application
      if (existingOrder.discountValue) {
        // Restore original price
        updateData.tongsotien =
          Number(existingOrder.tongsotien || 0) +
          Number(existingOrder.discountValue || 0);
        updateData.idDiscount = null;
        updateData.discountValue = null;
      }
    }

    // Update the order
    const updatedOrder = await prisma.donhang.update({
      where: { iddonhang: idDonHang },
      data: updateData,
      include: {
        chitietdonhang: {
          include: {
            sanpham: true,
            size: true,
          },
        },
        users: true,
        discount: true,
        diaChiGiaoHang: true,
        thanhtoan: true,
      },
    });

    // Send email notification if requested
    let emailSent = false;
    if (sendEmail && updatedOrder.users?.Email) {
      try {
        // Prepare order details for email
        const orderDetails = {
          iddonhang: updatedOrder.iddonhang,
          ngaydat: updatedOrder.ngaydat,
          tongsotien: Number(updatedOrder.tongsotien),
          tongsoluong: updatedOrder.tongsoluong,
          trangthai: updatedOrder.trangthai,
          discountValue: Number(updatedOrder.discountValue || 0),
          items: updatedOrder.chitietdonhang.map((item) => ({
            idsanpham: Number(item.idsanpham),
            soluong: Number(item.soluong || 0),
            dongia: Number(item.dongia),
            sanpham: {
              Tensanpham: item.sanpham?.tensanpham || "Sản phẩm không xác định",
              hinhanh: item.sanpham?.hinhanh || "",
              gia: Number(item.sanpham?.gia || 0),
              giamgia: item.sanpham?.giamgia
                ? Number(item.sanpham.giamgia)
                : null,
            },
            size: item.size
              ? {
                  idSize: item.size.idSize,
                  tenSize: item.size.tenSize,
                }
              : null,
          })),
          paymentMethod:
            updatedOrder.thanhtoan?.[0]?.phuongthucthanhtoan ||
            "Chưa thanh toán",
          shippingAddress: {
            idDiaChi: updatedOrder.diaChiGiaoHang?.idDiaChi || 0,
            tenNguoiNhan: updatedOrder.diaChiGiaoHang?.tenNguoiNhan || "",
            soDienThoai: updatedOrder.diaChiGiaoHang?.soDienThoai || "",
            diaChiChiTiet: updatedOrder.diaChiGiaoHang?.diaChiChiTiet || "",
            phuongXa: updatedOrder.diaChiGiaoHang?.phuongXa || "",
            quanHuyen: updatedOrder.diaChiGiaoHang?.quanHuyen || "",
            thanhPho: updatedOrder.diaChiGiaoHang?.thanhPho || "",
          },
          discount: updatedOrder.discount
            ? {
                code: updatedOrder.discount.code || "",
                discountType: updatedOrder.discount.discountType || "",
                value: Number(updatedOrder.discount.value || 0),
              }
            : null,
          payment: updatedOrder.thanhtoan?.[0]
            ? {
                idthanhtoan: updatedOrder.thanhtoan[0].idthanhtoan,
                phuongthucthanhtoan:
                  updatedOrder.thanhtoan[0].phuongthucthanhtoan || "",
                sotien: Number(updatedOrder.thanhtoan[0].sotien || 0),
                trangthai: updatedOrder.thanhtoan[0].trangthai || "",
                ngaythanhtoan: updatedOrder.thanhtoan[0].ngaythanhtoan,
              }
            : undefined,
        };

        await sendOrderStatusUpdateEmail(
          updatedOrder.users.Email,
          orderDetails
        );
        emailSent = true;
      } catch (emailError) {
        console.error("Error sending order status update email:", emailError);
        // Don't fail the request if email sending fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Cập nhật đơn hàng thành công",
      emailSent,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra params trước khi sử dụng
    if (!params || typeof params.id !== "string") {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    const iddonhang = Number.parseInt(params.id, 10);

    if (isNaN(iddonhang)) {
      return NextResponse.json(
        { message: "ID đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    // Check authorization
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the order exists
    const existingDonHang = await prisma.donhang.findUnique({
      where: { iddonhang },
    });

    if (!existingDonHang) {
      return NextResponse.json(
        { message: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    // Check if user has permission (admin or order owner)
    // Đã kiểm tra session !== null ở trên nên an toàn khi truy cập session.role và session.idUsers
    const isAdmin = session.role === "Admin";
    const isOwner = existingDonHang.idUsers === session.idUsers;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Không có quyền xóa đơn hàng này" },
        { status: 403 }
      );
    }

    // Delete the order
    await prisma.donhang.delete({ where: { iddonhang } });

    return NextResponse.json(
      {
        success: true,
        message: "Đơn hàng đã được xóa thành công",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi xóa đơn hàng" },
      { status: 500 }
    );
  }
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
