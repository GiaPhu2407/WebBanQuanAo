import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

interface CartItem {
  idsanpham: number;
  soluong: number;
  idSize?: number;
  idgiohang?: number;
  sanpham: {
    gia: number;
    Tensanpham: string;
    hinhanh: string;
  };
}

interface OrderData {
  orders: any[];
  orderDetails: any[];
  payments: any[];
  deliverySchedules: any[];
  notification?: any;
}

interface DiscountInfo {
  idDiscount: number;
  code: string;
  discountType: string;
  value: number;
  calculatedDiscount: number;
  maxDiscount?: number | null;
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      cartItems,
      stripeSessionId,
      paymentMethod,
      imageURL,
      orderId,
      discountInfo,
    } = body;

    const userId =
      typeof session.idUsers === "string"
        ? parseInt(session.idUsers, 10)
        : session.idUsers;

    // Handle Stripe payment initiation
    if (paymentMethod === "stripe" && !stripeSessionId && cartItems) {
      try {
        // Calculate original total before discount
        const originalTotal = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + Number(item.sanpham.gia) * item.soluong,
          0
        );

        // Apply discount if available
        const discountAmount = discountInfo?.calculatedDiscount || 0;

        // Calculate final total after discount
        const finalTotal = Math.max(0, originalTotal - discountAmount);

        // Prepare line items for Stripe with individual products
        const lineItems = cartItems.map((item: CartItem) => ({
          price_data: {
            currency: "vnd",
            product_data: {
              name: item.sanpham.Tensanpham,
              images: [item.sanpham.hinhanh],
            },
            unit_amount: item.sanpham.gia,
          },
          quantity: item.soluong,
        }));

        // Add discount as a separate line item if applicable
        if (discountInfo && discountAmount > 0) {
          lineItems.push({
            price_data: {
              currency: "vnd",
              product_data: {
                name: `Giảm giá (${discountInfo.code})`,
                images: [],
              },
              unit_amount: -discountAmount, // Negative amount to represent discount
            },
            quantity: 1,
          });
        }

        // Create Stripe checkout session with all necessary metadata
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
          metadata: {
            userId: userId.toString(),
            cartItems: JSON.stringify(cartItems),
            discountCode: discountInfo?.code || "",
            discountId: discountInfo?.idDiscount?.toString() || "",
            discountAmount: discountInfo?.calculatedDiscount?.toString() || "0",
          },
        });

        return NextResponse.json({
          success: true,
          url: stripeSession.url,
          sessionId: stripeSession.id,
          originalTotal,
          discountAmount,
          finalTotal,
        });
      } catch (error) {
        console.error("Stripe session creation error:", error);
        return NextResponse.json(
          { error: "Không thể tạo phiên thanh toán Stripe" },
          { status: 500 }
        );
      }
    }

    // Handle Stripe payment completion
    if (stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          stripeSessionId
        );

        if (!session.metadata?.cartItems) {
          throw new Error("Không tìm thấy thông tin giỏ hàng trong metadata");
        }

        const cartItems = JSON.parse(session.metadata.cartItems);
        const discountCode = session.metadata.discountCode || null;
        const discountId = session.metadata.discountId
          ? parseInt(session.metadata.discountId)
          : null;
        const discountAmount = session.metadata.discountAmount
          ? parseFloat(session.metadata.discountAmount)
          : 0;

        return await processOrder(
          cartItems,
          "stripe",
          userId,
          session.customer_details?.name || "",
          stripeSessionId,
          discountId,
          discountAmount
        );
      } catch (error) {
        console.error("Stripe payment completion error:", error);
        return NextResponse.json(
          { error: "Không thể hoàn tất thanh toán Stripe" },
          { status: 500 }
        );
      }
    }

    // Handle online transfer payment with proof
    if (paymentMethod === "online" && imageURL && orderId) {
      try {
        const orderIdNumber = parseInt(orderId);
        const order = await prisma.donhang.findUnique({
          where: { iddonhang: orderIdNumber },
          include: {
            chitietdonhang: {
              include: {
                sanpham: true,
              },
            },
            thanhtoan: true,
          },
        });

        if (!order) {
          return NextResponse.json(
            { error: "Đơn hàng không tồn tại" },
            { status: 404 }
          );
        }

        // Calculate final amount considering discount
        const totalAmount = order.discountValue
          ? Number(order.tongsotien) // tongsotien already has discount applied
          : order.tongsotien;

        let payment;
        if (order.thanhtoan && order.thanhtoan.length > 0) {
          payment = await prisma.thanhtoan.update({
            where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
            data: {
              phuongthucthanhtoan: "online",
              sotien: totalAmount, // Use the discounted amount
              trangthai: "Chờ xác nhận",
              ngaythanhtoan: new Date(),
              hinhanhthanhtoan: imageURL,
            },
          });
        } else {
          payment = await prisma.thanhtoan.create({
            data: {
              iddonhang: orderIdNumber,
              phuongthucthanhtoan: "online",
              sotien: totalAmount, // Use the discounted amount
              trangthai: "Chờ xác nhận",
              ngaythanhtoan: new Date(),
              hinhanhthanhtoan: imageURL,
            },
          });
        }

        await prisma.donhang.update({
          where: { iddonhang: orderIdNumber },
          data: { trangthai: "Chờ xác nhận thanh toán" },
        });

        const notification = await prisma.notification.create({
          data: {
            idUsers: userId,
            title: "Thanh toán chuyển khoản",
            message: `Thanh toán cho đơn hàng #${orderIdNumber} đã được gửi và đang chờ xác nhận`,
            type: "payment",
            idDonhang: orderIdNumber,
            idThanhtoan: payment.idthanhtoan,
            isRead: false,
            createdAt: new Date(),
          },
        });

        await pusherServer.trigger(
          "notifications",
          "new-notification",
          notification
        );

        return NextResponse.json({
          success: true,
          message: "Đã cập nhật chứng từ thanh toán",
          payment,
        });
      } catch (error) {
        console.error("Error processing payment proof:", error);
        return NextResponse.json(
          { error: "Không thể xử lý minh chứng thanh toán" },
          { status: 500 }
        );
      }
    }

    // Handle cash payment
    if (paymentMethod === "cash" && orderId) {
      try {
        const orderIdNumber = parseInt(orderId);
        const order = await prisma.donhang.findUnique({
          where: { iddonhang: orderIdNumber },
          include: {
            chitietdonhang: {
              include: {
                sanpham: true,
              },
            },
            thanhtoan: true,
          },
        });

        if (!order) {
          return NextResponse.json(
            { error: "Đơn hàng không tồn tại" },
            { status: 404 }
          );
        }

        // Calculate final amount considering discount
        const totalAmount = order.tongsotien; // tongsotien already has discount applied

        let payment;
        if (order.thanhtoan && order.thanhtoan.length > 0) {
          payment = await prisma.thanhtoan.update({
            where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
            data: {
              phuongthucthanhtoan: "cash",
              sotien: totalAmount, // Use the already discounted amount
              trangthai: "Chờ xác nhận",
              ngaythanhtoan: new Date(),
            },
          });
        } else {
          payment = await prisma.thanhtoan.create({
            data: {
              iddonhang: orderIdNumber,
              phuongthucthanhtoan: "cash",
              sotien: totalAmount, // Use the already discounted amount
              trangthai: "Chờ xác nhận",
              ngaythanhtoan: new Date(),
            },
          });
        }

        await prisma.donhang.update({
          where: { iddonhang: orderIdNumber },
          data: { trangthai: "Chờ xác nhận thanh toán" },
        });

        const notification = await prisma.notification.create({
          data: {
            idUsers: userId,
            title: "Thanh toán tiền mặt",
            message: `Thanh toán tiền mặt cho đơn hàng #${orderIdNumber} đã được ghi nhận và đang chờ xác nhận`,
            type: "payment",
            idDonhang: orderIdNumber,
            idThanhtoan: payment.idthanhtoan,
            isRead: false,
            createdAt: new Date(),
          },
        });

        await pusherServer.trigger(
          "notifications",
          "new-notification",
          notification
        );

        return NextResponse.json({
          success: true,
          message: "Thanh toán tiền mặt đã được ghi nhận",
          payment,
        });
      } catch (error) {
        console.error("Error processing cash payment:", error);
        return NextResponse.json(
          { error: "Lỗi khi xử lý thanh toán tiền mặt" },
          { status: 500 }
        );
      }
    }

    // Handle new order creation with initial payment method
    if (cartItems && Array.isArray(cartItems)) {
      const discountId = discountInfo?.idDiscount || null;
      const discountAmount = discountInfo?.calculatedDiscount || 0;

      return await processOrder(
        cartItems,
        paymentMethod,
        userId,
        session.name,
        undefined,
        discountId,
        discountAmount
      );
    }

    return NextResponse.json(
      { error: "Thông số yêu cầu không hợp lệ" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Lỗi nội bộ trong quá trình xử lý thanh toán" },
      { status: 500 }
    );
  }
}

async function processOrder(
  cartItems: CartItem[],
  paymentMethod: string,
  userId: number,
  customerName: string,
  stripeSessionId?: string,
  discountId?: number | null,
  discountAmount: number = 0
): Promise<NextResponse> {
  if (!Array.isArray(cartItems)) {
    return NextResponse.json(
      { error: "Dữ liệu giỏ hàng không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction<OrderData>(async (prisma) => {
      const cartItemsWithDetails = await getCartItemsWithDetails(
        prisma,
        cartItems
      );

      // Calculate original total without discount
      const { totalAmount: originalTotal, totalQuantity } =
        calculateOrderTotals(cartItemsWithDetails);

      // Calculate final total after applying discount
      const finalTotal = Math.max(0, originalTotal - discountAmount);

      // Create order with discount info and the final total (after discount)
      const order = await createOrder(
        prisma,
        userId,
        finalTotal, // Save the final total after discount
        totalQuantity,
        discountId,
        discountAmount // Save the discount amount
      );

      const orderDetails = await createOrderDetails(
        prisma,
        order.iddonhang,
        cartItemsWithDetails
      );

      const deliverySchedules = await createDeliverySchedules(
        prisma,
        order.iddonhang,
        cartItemsWithDetails,
        userId
      );

      // Create payment record with the final total (after discount)
      const payment = await prisma.thanhtoan.create({
        data: {
          iddonhang: order.iddonhang,
          phuongthucthanhtoan: paymentMethod,
          sotien: finalTotal, // Use the discounted amount
          trangthai: stripeSessionId
            ? `STRIPE:${stripeSessionId}`
            : "Chờ thanh toán",
          ngaythanhtoan: new Date(),
        },
      });

      // Increment the used count of the discount code if applicable
      if (discountId) {
        await prisma.discountCode.update({
          where: { idDiscount: discountId },
          data: { usedCount: { increment: 1 } },
        });
      }

      await clearCart(prisma, cartItems);

      // Create notification with discount info
      let notificationMessage = `Đơn hàng #${order.iddonhang} đã được tạo thành công`;
      if (discountId && discountAmount > 0) {
        notificationMessage += ` với giảm giá ${formatCurrency(
          discountAmount
        )}`;
      }

      const notification = await prisma.notification.create({
        data: {
          idUsers: userId,
          title: "Đơn hàng mới",
          message: notificationMessage,
          type: "order",
          idDonhang: order.iddonhang,
          idThanhtoan: payment.idthanhtoan,
          isRead: false,
          createdAt: new Date(),
        },
      });

      return {
        orders: [order],
        orderDetails,
        payments: [payment],
        deliverySchedules,
        notification,
      };
    });

    // Send real-time notification
    if (result.notification) {
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        result.notification
      );
    }

    // Get order and discount details for response
    const order = result.orders[0];
    const discountValue = order.discountValue || 0;

    // Calculate total before discount (needed for display)
    const originalTotal = Number(order.tongsotien) + Number(discountValue);

    const successMessage =
      discountValue > 0
        ? `Đơn hàng đã được tạo với giảm giá ${formatCurrency(
            Number(discountValue)
          )}. ${
            paymentMethod === "online"
              ? "Vui lòng tiếp tục để tải lên chứng từ thanh toán."
              : ""
          }`
        : paymentMethod === "online"
        ? "Đơn hàng đã được tạo. Vui lòng tiếp tục để tải lên chứng từ thanh toán."
        : "Đơn hàng đã được tạo thành công.";

    return NextResponse.json({
      success: true,
      data: result,
      message: successMessage,
      originalTotal: originalTotal, // Original total before discount
      discountAmount: Number(order.discountValue || 0), // Discount amount
      finalTotal: order.tongsotien, // Final amount after discount
    });
  } catch (error) {
    return handleProcessOrderError(error);
  }
}

async function getCartItemsWithDetails(prisma: any, cartItems: CartItem[]) {
  return await Promise.all(
    cartItems.map(async (item) => {
      const product = await prisma.sanpham.findUnique({
        where: { idsanpham: item.idsanpham },
      });

      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm có ID ${item.idsanpham}`);
      }

      return { ...item, sanpham: product };
    })
  );
}

function calculateOrderTotals(cartItems: CartItem[]) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.sanpham.gia) * item.soluong,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.soluong, 0);
  return { totalAmount, totalQuantity };
}

async function createOrder(
  prisma: any,
  userId: number,
  finalAmount: number,
  totalQuantity: number,
  discountId: number | null = null,
  discountValue: number = 0
) {
  return await prisma.donhang.create({
    data: {
      idUsers: userId,
      ngaydat: new Date(),
      trangthai: "Chờ thanh toán",
      tongsotien: finalAmount, // This is the final amount after discount
      tongsoluong: totalQuantity,
      idDiscount: discountId || null,
      discountValue: discountValue ? new Prisma.Decimal(discountValue) : null,
    },
  });
}

async function createOrderDetails(
  prisma: any,
  orderId: number,
  cartItems: CartItem[]
) {
  const orderDetails = [];
  for (const item of cartItems) {
    const orderDetail = await prisma.chitietDonhang.create({
      data: {
        iddonhang: orderId,
        idsanpham: item.idsanpham,
        idSize: item.idSize,
        soluong: item.soluong,
        dongia: Number(item.sanpham.gia),
      },
    });
    orderDetails.push(orderDetail);
  }
  return orderDetails;
}

async function createDeliverySchedules(
  prisma: any,
  orderId: number,
  cartItems: CartItem[],
  userId: number
) {
  const deliverySchedules = [];
  for (const item of cartItems) {
    const deliverySchedule = await prisma.lichGiaoHang.create({
      data: {
        iddonhang: orderId,
        idsanpham: item.idsanpham,
        idKhachHang: userId,
        NgayGiao: calculateDeliveryDate(),
        TrangThai: "Chờ giao",
      },
    });
    deliverySchedules.push(deliverySchedule);
  }
  return deliverySchedules;
}

async function clearCart(prisma: any, cartItems: CartItem[]) {
  for (const item of cartItems) {
    if (item.idgiohang) {
      try {
        await prisma.giohang.delete({
          where: { idgiohang: item.idgiohang },
        });
      } catch (err) {
        console.warn(
          `Mặt hàng có idgiohang ${item.idgiohang} có thể đã bị xóa rồi`
        );
      }
    }
  }
}

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

function handleProcessOrderError(error: any) {
  console.error("Transaction error:", error);

  let errorMessage = "Lỗi xử lý đơn hàng";
  let errorDetails = "";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    errorMessage = `Lỗi cơ sở dữ liệu: ${error.message}`;
    errorDetails = JSON.stringify({
      code: error.code,
      meta: error.meta,
      model: (error.meta as any)?.modelName || "unknown",
    });
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  }

  return NextResponse.json(
    {
      error: errorMessage,
      details: errorDetails,
    },
    { status: 500 }
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.donhang.findMany({
      where: { idUsers: session.idUsers },
      include: {
        chitietdonhang: {
          include: {
            sanpham: true,
          },
        },
        thanhtoan: true,
        lichgiaohang: true,
        discount: true,
      },
      orderBy: { ngaydat: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
