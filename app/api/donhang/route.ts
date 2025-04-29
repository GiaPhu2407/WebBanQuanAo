import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { sendOrderConfirmationEmail } from "@/lib/emailOrder";

export async function POST(request: NextRequest) {
  try {
    // Parse dữ liệu từ request body
    const body = await request.json();
    const {
      idUsers,
      chitietDonhang,
      trangthai = "Đang xử lý",
      discountCode = null,
      idDiaChi = null, // Add shipping address ID
      sendEmail = false, // Option to send email notification
    } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!idUsers || !chitietDonhang || chitietDonhang.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin cần thiết để tạo đơn hàng." },
        { status: 400 }
      );
    }

    // Kiểm tra địa chỉ giao hàng
    if (!idDiaChi) {
      return NextResponse.json(
        { error: "Vui lòng chọn địa chỉ giao hàng." },
        { status: 400 }
      );
    }

    // Verify the address exists and belongs to the user
    const diaChi = await prisma.diaChi.findUnique({
      where: { idDiaChi },
    });

    if (!diaChi) {
      return NextResponse.json(
        { error: "Địa chỉ giao hàng không tồn tại." },
        { status: 404 }
      );
    }

    if (diaChi.idUsers !== idUsers) {
      return NextResponse.json(
        { error: "Không có quyền sử dụng địa chỉ này." },
        { status: 403 }
      );
    }

    // Tính tổng số lượng và tổng số tiền từ danh sách chi tiết đơn hàng
    let tongsoluong = 0;
    let originalTotal = 0; // Tổng tiền gốc trước khi áp dụng giảm giá

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
      originalTotal += soluong * Number(sanpham.gia);
    }

    // Xử lý mã giảm giá nếu có
    let idDiscount = null;
    let discountValue = 0; // Giá trị giảm giá (số tiền được giảm)
    let finalTotalAmount = originalTotal; // Khởi tạo với giá ban đầu
    let discountDetails = null;

    if (discountCode) {
      // Tìm mã giảm giá hợp lệ
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

      // Kiểm tra giá trị đơn hàng tối thiểu
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

      // Tính giá trị giảm
      if (discount.discountType === "PERCENTAGE") {
        discountValue = (originalTotal * Number(discount.value)) / 100;

        // Áp dụng giới hạn giảm giá tối đa nếu có
        if (
          discount.maxDiscount &&
          discountValue > Number(discount.maxDiscount)
        ) {
          discountValue = Number(discount.maxDiscount);
        }
      } else {
        // FIXED_AMOUNT
        discountValue = Number(discount.value);
      }

      // Cập nhật số lần sử dụng của mã giảm giá
      await prisma.discountCode.update({
        where: { idDiscount: discount.idDiscount },
        data: { usedCount: { increment: 1 } },
      });

      idDiscount = discount.idDiscount;
      finalTotalAmount = originalTotal - discountValue; // Tính tổng tiền sau khi giảm giá

      discountDetails = {
        code: discount.code,
        discountType: discount.discountType,
        value: Number(discount.value),
        calculatedDiscount: discountValue,
      };
    }

    // Đảm bảo finalTotalAmount không âm
    finalTotalAmount = Math.max(0, finalTotalAmount);

    // Tạo mới đơn hàng với giá trị đã giảm và địa chỉ giao hàng
    const newDonhang = await prisma.donhang.create({
      data: {
        idUsers,
        tongsoluong,
        tongsotien: finalTotalAmount, // Lưu số tiền sau khi đã giảm giá
        trangthai,
        ngaydat: new Date().toISOString(),
        idDiscount,
        discountValue: discountValue ? discountValue : null, // Lưu giá trị giảm giá (số tiền được giảm)
        idDiaChi, // Add shipping address reference
      },
    });

    // Tạo thông báo với thông tin giảm giá
    const notification = await prisma.notification.create({
      data: {
        idUsers,
        title: "Đơn hàng mới",
        message: `Đơn hàng #${newDonhang.iddonhang} đã được tạo thành công${
          discountValue > 0
            ? ` với giảm giá ${formatCurrency(discountValue)}`
            : ""
        }`,
        type: "order",
        idDonhang: newDonhang.iddonhang,
        isRead: false,
        createdAt: new Date(),
      },
    });

    // Gửi thông báo realtime nếu có pusherServer
    if (pusherServer) {
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        notification
      );
    }

    // Thêm chi tiết đơn hàng
    const createdChitietDonhang = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        // Get product price from database to ensure accuracy
        const sanpham = await prisma.sanpham.findUnique({
          where: { idsanpham: item.idsanpham },
          select: { gia: true, tensanpham: true, hinhanh: true },
        });

        return await prisma.chitietDonhang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            dongia: sanpham ? Number(sanpham.gia) : item.dongia, // Use accurate price from DB or fallback to provided price
            idSize: item.idSize || null, // Thêm size nếu có
            // Remove the tensanpham field as it's not in the ChitietDonhang schema
          },
        });
      })
    );

    // Tạo lịch giao hàng (nếu cần)
    const deliverySchedules = await Promise.all(
      chitietDonhang.map(async (item: any) => {
        return await prisma.lichGiaoHang.create({
          data: {
            iddonhang: newDonhang.iddonhang,
            idsanpham: item.idsanpham,
            idKhachHang: idUsers,
            NgayGiao: calculateDeliveryDate(),
            TrangThai: "Chờ giao",
          },
        });
      })
    );

    // Gửi email xác nhận nếu được yêu cầu
    let emailSent = false;
    if (sendEmail) {
      try {
        // Lấy thông tin người dùng để gửi email
        const user = await prisma.users.findUnique({
          where: { idUsers },
          select: { Email: true },
        });

        if (user?.Email) {
          // Lấy thông tin đơn hàng đầy đủ để gửi email
          const orderWithDetails = await prisma.donhang.findUnique({
            where: { iddonhang: newDonhang.iddonhang },
            include: {
              chitietdonhang: {
                include: {
                  sanpham: true,
                  size: true,
                },
              },
              discount: true,
              diaChiGiaoHang: true,
            },
          });

          if (orderWithDetails) {
            // Chuẩn bị dữ liệu cho email
            const orderDetails = {
              iddonhang: orderWithDetails.iddonhang,
              ngaydat: orderWithDetails.ngaydat,
              tongsotien: Number(orderWithDetails.tongsotien),
              tongsoluong: orderWithDetails.tongsoluong,
              trangthai: orderWithDetails.trangthai,
              discountValue: Number(orderWithDetails.discountValue || 0),
              items: orderWithDetails.chitietdonhang.map((item) => ({
                idsanpham: Number(item.idsanpham),
                soluong: Number(item.soluong || 0),
                dongia: Number(item.dongia),
                sanpham: {
                  Tensanpham:
                    item.sanpham?.tensanpham || "Sản phẩm không xác định",
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
              paymentMethod: "Chưa thanh toán",
              shippingAddress: {
                idDiaChi: orderWithDetails.diaChiGiaoHang?.idDiaChi || 0,
                tenNguoiNhan:
                  orderWithDetails.diaChiGiaoHang?.tenNguoiNhan || "",
                soDienThoai: orderWithDetails.diaChiGiaoHang?.soDienThoai || "",
                diaChiChiTiet:
                  orderWithDetails.diaChiGiaoHang?.diaChiChiTiet || "",
                phuongXa: orderWithDetails.diaChiGiaoHang?.phuongXa || "",
                quanHuyen: orderWithDetails.diaChiGiaoHang?.quanHuyen || "",
                thanhPho: orderWithDetails.diaChiGiaoHang?.thanhPho || "",
              },
              discount: orderWithDetails.discount
                ? {
                    code: orderWithDetails.discount.code || "",
                    discountType: orderWithDetails.discount.discountType || "",
                    value: Number(orderWithDetails.discount.value || 0),
                  }
                : null,
              payment: undefined,
            };

            await sendOrderConfirmationEmail(user.Email, orderDetails);
            emailSent = true;
          }
        }
      } catch (emailError) {
        console.error("Error sending order confirmation email:", emailError);
        // Không trả về lỗi nếu gửi email thất bại, chỉ ghi log
      }
    }

    // Trả về thông tin đơn hàng và các chi tiết đã thêm
    return NextResponse.json(
      {
        success: true,
        message: "Đơn hàng đã được tạo thành công",
        donhang: newDonhang,
        chitietDonhang: createdChitietDonhang,
        lichGiaoHang: deliverySchedules,
        discountApplied:
          discountValue > 0
            ? {
                code: discountCode,
                value: discountValue,
                originalTotal: originalTotal,
                finalTotal: finalTotalAmount,
              }
            : null,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo đơn hàng." },
      { status: 500 }
    );
  }
}

// GET method to fetch all orders
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin (role-based access)
    const isAdmin = session.role === "admin";

    // Build the query based on user role
    const whereClause = isAdmin
      ? {} // Admin can see all orders
      : { idUsers: session.idUsers }; // Regular users can only see their own orders

    const donhang = await prisma.donhang.findMany({
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
      orderBy: {
        ngaydat: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: donhang,
      message: "Lấy danh sách đơn hàng thành công.",
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE method to delete all orders (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This is a dangerous operation, so we should add additional safeguards
    const body = await request.json();
    const { confirmDelete } = body;

    if (confirmDelete !== "DELETE_ALL_ORDERS") {
      return NextResponse.json(
        {
          error:
            "Xác nhận xóa không hợp lệ. Vui lòng cung cấp mã xác nhận chính xác.",
        },
        { status: 400 }
      );
    }

    // Delete all orders
    const deletedOrders = await prisma.donhang.deleteMany();

    return NextResponse.json(
      {
        success: true,
        message: `Đã xóa ${deletedOrders.count} đơn hàng.`,
        count: deletedOrders.count,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm tính ngày giao hàng dự kiến
function calculateDeliveryDate(): Date {
  const orderDate = new Date();
  const earliestDeliveryDate = new Date(orderDate);
  earliestDeliveryDate.setDate(orderDate.getDate() + 3);

  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 6);

  const deliveryDate = new Date(
    earliestDeliveryDate.getTime() +
      Math.random() *
        (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
  );

  deliveryDate.setHours(
    8 + Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 60),
    0,
    0
  );
  return deliveryDate;
}
