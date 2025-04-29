import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";
import {
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
} from "@/lib/emailOrder";
import { request } from "http";

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
  adminNotification?: any;
}

// Discount information interface
interface DiscountInfo {
  idDiscount: number;
  code: string;
  discountType: string;
  value: number;
  calculatedDiscount: number;
  maxDiscount?: number | null;
}

export async function POST(req: NextRequest) {
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
      DiscountInfo,
      idDiaChi, // Added shipping address ID
    } = body;

    // Debug discount information
    console.log("API endpoint received discountInfo:", DiscountInfo);
    console.log("API endpoint received shipping address ID:", idDiaChi);

    const userId =
      typeof session.idUsers === "string"
        ? Number.parseInt(session.idUsers, 10)
        : session.idUsers;

    // Verify address belongs to user before proceeding
    if (idDiaChi) {
      try {
        const address = await prisma.diaChi.findUnique({
          where: { idDiaChi: Number(idDiaChi) },
        });

        if (!address) {
          return NextResponse.json(
            { error: "Địa chỉ không tồn tại" },
            { status: 404 }
          );
        }

        if (address.idUsers !== userId) {
          return NextResponse.json(
            { error: "Bạn không có quyền sử dụng địa chỉ này" },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error("Error verifying address:", error);
        return NextResponse.json(
          { error: "Không thể xác minh địa chỉ giao hàng" },
          { status: 500 }
        );
      }
    } else if (!orderId) {
      // Only require address for new orders, not for updating existing ones
      return NextResponse.json(
        { error: "Vui lòng chọn địa chỉ giao hàng" },
        { status: 400 }
      );
    }

    // Handling Stripe payment initialization
    if (paymentMethod === "stripe" && !stripeSessionId && cartItems) {
      try {
        // Calculate original total before discount
        const originalTotal = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + Number(item.sanpham.gia) * item.soluong,
          0
        );

        // Apply discount if available
        const discountAmount = DiscountInfo?.calculatedDiscount || 0;
        const finalTotal = Math.max(0, originalTotal - discountAmount);

        // Get the discount ID correctly - ensure it's a number
        const discountId = DiscountInfo?.idDiscount
          ? Number(DiscountInfo.idDiscount)
          : null;

        console.log(
          `Original Total: ${originalTotal}, Discount: ${discountAmount}, Final Amount: ${finalTotal}, Discount ID: ${discountId}`
        );

        // Prepare items for Stripe
        const lineItems = cartItems.map((item: CartItem) => {
          return {
            price_data: {
              currency: "vnd",
              product_data: {
                name: item.sanpham.Tensanpham,
                images: [item.sanpham.hinhanh],
                description:
                  discountAmount > 0
                    ? `Original price: ${formatCurrency(
                        Number(item.sanpham.gia)
                      )}${discountAmount > 0 ? " (Discount applied)" : ""}`
                    : undefined,
              },
              unit_amount: Number(item.sanpham.gia),
            },
            quantity: item.soluong,
          };
        });

        // Add discount line item if applicable
        if (discountAmount > 0) {
          lineItems.push({
            price_data: {
              currency: "vnd",
              product_data: {
                name: `Discount (${DiscountInfo.code})`,
                images: [],
                description: `Applied discount code: ${DiscountInfo.code}`,
              },
              unit_amount: -discountAmount,
            },
            quantity: 1,
          });
        }

        // Create Stripe session with the discounted total
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
          metadata: {
            userId: userId.toString(),
            cartItems: JSON.stringify(cartItems),
            discountCode: DiscountInfo?.code || "",
            discountId: discountId !== null ? discountId.toString() : "",
            discountAmount: discountAmount.toString(),
            originalTotal: originalTotal.toString(),
            finalTotal: finalTotal.toString(),
            addressId: idDiaChi ? idDiaChi.toString() : "", // Include address ID in metadata
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
        console.error("Error creating Stripe session:", error);
        return NextResponse.json(
          { error: "Could not create Stripe payment session" },
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
          throw new Error("Cart items not found in metadata");
        }

        const cartItems = JSON.parse(session.metadata.cartItems);

        // Ensure proper conversion of discountId to number
        const discountId =
          session.metadata.discountId && session.metadata.discountId !== ""
            ? Number.parseInt(session.metadata.discountId, 10)
            : null;

        const discountAmount = session.metadata.discountAmount
          ? Number.parseFloat(session.metadata.discountAmount)
          : 0;

        const finalTotal = session.metadata.finalTotal
          ? Number.parseFloat(session.metadata.finalTotal)
          : null;

        // Get address ID from metadata
        const addressId = session.metadata.addressId
          ? Number.parseInt(session.metadata.addressId, 10)
          : null;

        console.log("Stripe session metadata:", {
          discountId,
          discountAmount,
          finalTotal,
          addressId,
        });

        // Create admin notification for Stripe payment
        const adminNotification = await prisma.notification.create({
          data: {
            idUsers: 1, // Assuming admin ID is 1, adjust as needed
            title: "Thanh toán Stripe mới",
            message: `Khách hàng ${
              session.customer_details?.name || userId
            } đã hoàn tất thanh toán đơn hàng qua Stripe. Số tiền: ${formatCurrency(
              Number.parseFloat(session.metadata.finalTotal || "0")
            )}`,
            type: "admin_payment",
            isRead: false,
            createdAt: new Date(),
          },
        });

        // Send real-time notification to admin
        await pusherServer.trigger(
          "admin-notifications",
          "new-notification",
          adminNotification
        );

        // Pass the final total from Stripe session to processOrder
        return await processOrder(
          cartItems,
          "stripe",
          userId,
          session.customer_details?.name || "",
          stripeSessionId,
          discountId,
          discountAmount,
          finalTotal,
          addressId // Pass address ID to processOrder
        );
      } catch (error) {
        console.error("Error completing Stripe payment:", error);
        return NextResponse.json(
          { error: "Could not complete Stripe payment" },
          { status: 500 }
        );
      }
    }

    // Handle bank transfer payment with receipt
    if (paymentMethod === "online" && imageURL && orderId) {
      try {
        const orderIdNumber = Number.parseInt(orderId);

        // Get order information including discount info
        const order = await prisma.donhang.findUnique({
          where: { iddonhang: orderIdNumber },
          include: {
            chitietdonhang: {
              include: {
                sanpham: true,
                size: true,
              },
            },
            thanhtoan: true,
            discount: true, // Add this to get discount information
            diaChiGiaoHang: true,
          },
        });

        if (!order) {
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          );
        }

        // Determine original total and discount values
        const originalTotal = Number(order.tongsotien);
        const discountAmount = Number(order.discountValue || 0);
        const finalAmount = originalTotal;

        // If discount information exists, display it correctly
        if (order.discount) {
          console.log(
            `Found discount code: ${order.discount.code}, ID: ${order.discount.idDiscount}`
          );
        }

        console.log(
          `Order ${orderIdNumber}: Original total: ${
            originalTotal + discountAmount
          }, Discount: ${discountAmount}, Final amount: ${finalAmount}, Discount ID: ${
            order.idDiscount
          }`
        );

        let payment;
        if (order.thanhtoan && order.thanhtoan.length > 0) {
          payment = await prisma.thanhtoan.update({
            where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
            data: {
              phuongthucthanhtoan: "online",
              sotien: finalAmount,
              trangthai: "Pending confirmation",
              ngaythanhtoan: new Date(),
              hinhanhthanhtoan: imageURL,
            },
          });
        } else {
          payment = await prisma.thanhtoan.create({
            data: {
              iddonhang: orderIdNumber,
              phuongthucthanhtoan: "online",
              sotien: finalAmount,
              trangthai: "Pending confirmation",
              ngaythanhtoan: new Date(),
              hinhanhthanhtoan: imageURL,
            },
          });
        }

        await prisma.donhang.update({
          where: { iddonhang: orderIdNumber },
          data: { trangthai: "Waiting for payment confirmation" },
        });

        // Create notification with discount information if applicable
        const discountMessage =
          discountAmount > 0
            ? ` (giảm giá ${formatCurrency(discountAmount)})`
            : "";

        const notification = await prisma.notification.create({
          data: {
            idUsers: userId,
            title: "Thanh toán chuyển khoản",
            message: `Thanh toán cho đơn hàng #${orderIdNumber}${discountMessage} đã được gửi và đang chờ xác nhận`,
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

        // Create admin notification for bank transfer payment
        const adminNotification = await prisma.notification.create({
          data: {
            idUsers: 1, // Assuming admin ID is 1, adjust as needed
            title: "Thanh toán chuyển khoản mới",
            message: `Khách hàng ID: ${userId} đã gửi biên lai thanh toán cho đơn hàng #${orderIdNumber}${discountMessage}. Cần xác minh.`,
            type: "admin_payment",
            idDonhang: orderIdNumber,
            idThanhtoan: payment.idthanhtoan,
            isRead: false,
            createdAt: new Date(),
          },
        });

        await pusherServer.trigger(
          "admin-notifications",
          "new-notification",
          adminNotification
        );

        // Get user email to send confirmation
        const user = await prisma.users.findUnique({
          where: { idUsers: userId },
          select: { Email: true },
        });

        if (user?.Email) {
          // Get order details for email
          const orderWithDetails = await prisma.donhang.findUnique({
            where: { iddonhang: orderIdNumber },
            include: {
              chitietdonhang: {
                include: {
                  sanpham: true,
                  size: true,
                },
              },
              discount: true,
              diaChiGiaoHang: true,
              thanhtoan: true,
            },
          });

          if (orderWithDetails && orderWithDetails.diaChiGiaoHang) {
            // Create a properly formatted shipping address
            const shippingAddress = {
              idDiaChi: orderWithDetails.diaChiGiaoHang.idDiaChi || 0,
              tenNguoiNhan: orderWithDetails.diaChiGiaoHang.tenNguoiNhan || "",
              soDienThoai: orderWithDetails.diaChiGiaoHang.soDienThoai || "",
              diaChiChiTiet:
                orderWithDetails.diaChiGiaoHang.diaChiChiTiet || "",
              phuongXa: orderWithDetails.diaChiGiaoHang.phuongXa || "",
              quanHuyen: orderWithDetails.diaChiGiaoHang.quanHuyen || "",
              thanhPho: orderWithDetails.diaChiGiaoHang.thanhPho || "",
            };

            // Format the items with proper type conversion
            const formattedItems = orderWithDetails.chitietdonhang.map(
              (item) => ({
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
              })
            );

            // Create the complete order details object with proper types
            const orderDetails = {
              iddonhang: orderWithDetails.iddonhang,
              ngaydat: orderWithDetails.ngaydat,
              tongsotien: Number(orderWithDetails.tongsotien),
              tongsoluong: orderWithDetails.tongsoluong,
              trangthai: orderWithDetails.trangthai,
              discountValue: Number(orderWithDetails.discountValue || 0),
              items: formattedItems,
              paymentMethod: "online",
              shippingAddress: shippingAddress,
              discount: orderWithDetails.discount
                ? {
                    code: orderWithDetails.discount.code || "",
                    discountType: orderWithDetails.discount.discountType || "",
                    value: Number(orderWithDetails.discount.value || 0),
                  }
                : null,
              payment: {
                idthanhtoan: payment.idthanhtoan,
                phuongthucthanhtoan: payment.phuongthucthanhtoan,
                sotien: Number(payment.sotien),
                trangthai: payment.trangthai,
                ngaythanhtoan: payment.ngaythanhtoan,
                hinhanhthanhtoan: payment.hinhanhthanhtoan,
              },
            };

            // Send confirmation email
            try {
              await sendOrderConfirmationEmail(user.Email, orderDetails);
              console.log(`Order confirmation email sent to ${user.Email}`);
            } catch (emailError) {
              console.error(
                "Error sending order confirmation email:",
                emailError
              );
            }
          }
        }

        return NextResponse.json({
          success: true,
          message: "Payment receipt updated",
          payment,
          originalTotal: originalTotal + discountAmount,
          discountAmount: discountAmount,
          finalTotal: finalAmount,
        });
      } catch (error) {
        console.error("Error processing payment receipt:", error);
        return NextResponse.json(
          { error: "Could not process payment evidence" },
          { status: 500 }
        );
      }
    }

    // Handle cash payment
    if (paymentMethod === "cash" && orderId) {
      try {
        const orderIdNumber = Number.parseInt(orderId);

        // Get order information including discount info
        const order = await prisma.donhang.findUnique({
          where: { iddonhang: orderIdNumber },
          include: {
            chitietdonhang: {
              include: {
                sanpham: true,
                size: true,
              },
            },
            thanhtoan: true,
            discount: true,
            diaChiGiaoHang: true,
          },
        });

        if (!order) {
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          );
        }

        // Determine original total and discount values
        const originalTotal = Number(order.tongsotien);
        const discountAmount = Number(order.discountValue || 0);
        const finalAmount = originalTotal;

        console.log(
          `Order ${orderIdNumber}: Original total: ${
            originalTotal + discountAmount
          }, Discount: ${discountAmount}, Final amount: ${finalAmount}, Discount ID: ${
            order.idDiscount
          }`
        );

        let payment;
        if (order.thanhtoan && order.thanhtoan.length > 0) {
          payment = await prisma.thanhtoan.update({
            where: { idthanhtoan: order.thanhtoan[0].idthanhtoan },
            data: {
              phuongthucthanhtoan: "cash",
              sotien: finalAmount,
              trangthai: "Pending confirmation",
              ngaythanhtoan: new Date(),
            },
          });
        } else {
          payment = await prisma.thanhtoan.create({
            data: {
              iddonhang: orderIdNumber,
              phuongthucthanhtoan: "cash",
              sotien: finalAmount,
              trangthai: "Pending confirmation",
              ngaythanhtoan: new Date(),
            },
          });
        }

        await prisma.donhang.update({
          where: { iddonhang: orderIdNumber },
          data: { trangthai: "Waiting for payment confirmation" },
        });

        // Create notification with discount information if applicable
        const discountMessage =
          discountAmount > 0
            ? ` (giảm giá ${formatCurrency(discountAmount)})`
            : "";

        const notification = await prisma.notification.create({
          data: {
            idUsers: userId,
            title: "Thanh toán tiền mặt",
            message: `Thanh toán tiền mặt cho đơn hàng #${orderIdNumber}${discountMessage} đã được ghi nhận và đang chờ xác nhận`,
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

        // Create admin notification for cash payment
        const adminNotification = await prisma.notification.create({
          data: {
            idUsers: 1, // Assuming admin ID is 1, adjust as needed
            title: "Thanh toán tiền mặt mới",
            message: `Khách hàng ID: ${userId} đã chọn thanh toán tiền mặt cho đơn hàng #${orderIdNumber}${discountMessage}. Cần xác nhận khi giao hàng.`,
            type: "admin_payment",
            idDonhang: orderIdNumber,
            idThanhtoan: payment.idthanhtoan,
            isRead: false,
            createdAt: new Date(),
          },
        });

        await pusherServer.trigger(
          "admin-notifications",
          "new-notification",
          adminNotification
        );

        // Get user email to send confirmation
        const user = await prisma.users.findUnique({
          where: { idUsers: userId },
          select: { Email: true },
        });

        if (user?.Email) {
          // Create a properly formatted shipping address
          const shippingAddress = {
            idDiaChi: order.diaChiGiaoHang?.idDiaChi || 0,
            tenNguoiNhan: order.diaChiGiaoHang?.tenNguoiNhan || "",
            soDienThoai: order.diaChiGiaoHang?.soDienThoai || "",
            diaChiChiTiet: order.diaChiGiaoHang?.diaChiChiTiet || "",
            phuongXa: order.diaChiGiaoHang?.phuongXa || "",
            quanHuyen: order.diaChiGiaoHang?.quanHuyen || "",
            thanhPho: order.diaChiGiaoHang?.thanhPho || "",
          };

          // Format the items with proper type conversion
          const formattedItems = order.chitietdonhang.map((item) => ({
            idsanpham: item.idsanpham ?? 0,
            soluong: item.soluong ?? 0,
            dongia: Number(item.dongia),
            sanpham: {
              Tensanpham: item.sanpham?.tensanpham || "Unknown product",
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
          }));

          // Create the complete order details object with proper types
          const orderDetails = {
            iddonhang: order.iddonhang,
            ngaydat: order.ngaydat,
            tongsotien: Number(order.tongsotien),
            tongsoluong: order.tongsoluong,
            trangthai: order.trangthai,
            discountValue: Number(order.discountValue || 0),
            items: formattedItems,
            paymentMethod: "cash",
            shippingAddress: shippingAddress,
            discount: order.discount
              ? {
                  code: order.discount.code || "",
                  discountType: order.discount.discountType || "",
                  value: Number(order.discount.value || 0),
                }
              : null,
            payment: {
              idthanhtoan: payment.idthanhtoan,
              phuongthucthanhtoan: payment.phuongthucthanhtoan,
              sotien: Number(payment.sotien),
              trangthai: payment.trangthai,
              ngaythanhtoan: payment.ngaythanhtoan,
            },
          };

          // Send confirmation email
          try {
            await sendOrderConfirmationEmail(user.Email, orderDetails);
            console.log(`Order confirmation email sent to ${user.Email}`);
          } catch (emailError) {
            console.error(
              "Error sending order confirmation email:",
              emailError
            );
          }
        }

        return NextResponse.json({
          success: true,
          message: "Cash payment recorded",
          payment,
          originalTotal: originalTotal + discountAmount,
          discountAmount: discountAmount,
          finalTotal: finalAmount,
        });
      } catch (error) {
        console.error("Error processing cash payment:", error);
        return NextResponse.json(
          { error: "Error when processing cash payment" },
          { status: 500 }
        );
      }
    }

    // Handle new order creation
    if (cartItems && Array.isArray(cartItems)) {
      // Validate address ID for new orders
      if (!idDiaChi) {
        return NextResponse.json(
          { error: "Vui lòng chọn địa chỉ giao hàng" },
          { status: 400 }
        );
      }

      // Check and process discount information
      let discountId = null;
      let discountAmount = 0;

      if (DiscountInfo) {
        // Ensure discountId is a number
        discountId = DiscountInfo.idDiscount
          ? Number.parseInt(String(DiscountInfo.idDiscount), 10)
          : null;
        discountAmount = DiscountInfo.calculatedDiscount || 0;

        console.log(
          "Creating new order with discount ID:",
          discountId,
          "type:",
          typeof discountId
        );
      }

      return await processOrder(
        cartItems,
        paymentMethod,
        userId,
        session.role || "",
        undefined,
        discountId,
        discountAmount,
        undefined,
        Number(idDiaChi) // Pass address ID to processOrder
      );
    }

    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal error during payment processing" },
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
  discountAmount = 0,
  finalTotal?: number | null,
  addressId?: number | null // Added address ID parameter
) {
  if (!Array.isArray(cartItems)) {
    return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  }

  try {
    // Debug logging
    console.log(
      "processOrder - discountId:",
      discountId,
      "type:",
      typeof discountId
    );
    console.log("processOrder - discountAmount:", discountAmount);
    console.log("processOrder - addressId:", addressId);

    // Validate address ID if provided
    if (addressId) {
      const address = await prisma.diaChi.findUnique({
        where: { idDiaChi: addressId },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Địa chỉ không tồn tại" },
          { status: 404 }
        );
      }

      if (address.idUsers !== userId) {
        return NextResponse.json(
          { error: "Bạn không có quyền sử dụng địa chỉ này" },
          { status: 403 }
        );
      }
    }

    const result = await prisma.$transaction<OrderData>(async (prisma) => {
      const cartItemsWithDetails = await getCartItemsWithDetails(
        prisma,
        cartItems
      );

      // Calculate totals
      const { totalAmount: originalTotal, totalQuantity } =
        calculateOrderTotals(cartItemsWithDetails);

      console.log(
        `Original total: ${originalTotal}, Discount: ${discountAmount}, Discount ID: ${discountId}`
      );

      // Use provided finalTotal if available, otherwise calculate it
      const actualFinalTotal =
        finalTotal !== null && finalTotal !== undefined
          ? finalTotal
          : Math.max(0, originalTotal - discountAmount);

      console.log(`Final amount: ${actualFinalTotal}`);

      // Create order with discounted total and save discount information
      const order = await createOrder(
        prisma,
        userId,
        actualFinalTotal,
        totalQuantity,
        discountId,
        discountAmount,
        addressId // Add address ID to order creation
      );

      console.log("Order created:", {
        iddonhang: order.iddonhang,
        tongsotien: order.tongsotien,
        idDiscount: order.idDiscount,
        discountValue: order.discountValue,
        idDiaChi: order.idDiaChi,
      });

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

      // Create payment record with discounted total
      const paymentStatus =
        paymentMethod === "stripe" && stripeSessionId
          ? `STRIPE:${stripeSessionId}`
          : "Awaiting payment";

      const payment = await prisma.thanhtoan.create({
        data: {
          iddonhang: order.iddonhang,
          phuongthucthanhtoan: paymentMethod,
          sotien: actualFinalTotal, // Use discounted amount
          trangthai: paymentStatus,
          ngaythanhtoan: new Date(),
        },
      });

      // Update discount usage count if applicable
      if (discountId !== null && discountId !== undefined && discountId > 0) {
        try {
          await prisma.discountCode.update({
            where: { idDiscount: discountId },
            data: { usedCount: { increment: 1 } },
          });
          console.log(`Updated usage count for discount ID: ${discountId}`);
        } catch (error) {
          console.error(`Error updating discount usage count:`, error);
        }
      }

      await clearCart(prisma, cartItems);

      // Get address details for notification
      let addressDetails = "";
      if (addressId) {
        try {
          const address = await prisma.diaChi.findUnique({
            where: { idDiaChi: addressId },
          });
          if (address) {
            addressDetails = `${address.tenNguoiNhan}, ${address.diaChiChiTiet}, ${address.phuongXa}, ${address.quanHuyen}, ${address.thanhPho}`;
          }
        } catch (error) {
          console.error("Error getting address details:", error);
        }
      }

      // Create customer notification with payment method and discount information
      const paymentMethodText = getPaymentMethodText(paymentMethod);
      const discountText =
        discountAmount > 0
          ? ` với giảm giá ${formatCurrency(discountAmount)}`
          : "";

      const addressText = addressDetails
        ? `\nĐịa chỉ giao hàng: ${addressDetails}`
        : "";

      const customerNotificationMessage = `Đơn hàng #${order.iddonhang} của bạn đã được tạo thành công${discountText}. Phương thức thanh toán: ${paymentMethodText}.${addressText}`;

      const notification = await prisma.notification.create({
        data: {
          idUsers: userId,
          title: "Xác nhận đơn hàng",
          message: customerNotificationMessage,
          type: "order",
          idDonhang: order.iddonhang,
          idThanhtoan: payment.idthanhtoan,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Create admin notification
      const adminNotificationMessage = `Đơn hàng mới #${order.iddonhang} được tạo bởi khách hàng ID: ${userId}${discountText}. Phương thức thanh toán: ${paymentMethodText}.${addressText}`;

      const adminNotification = await prisma.notification.create({
        data: {
          idUsers: 1, // Assuming admin ID is 1, adjust as needed
          title: "Đơn hàng mới",
          message: adminNotificationMessage,
          type: "admin_order",
          idDonhang: order.iddonhang,
          idThanhtoan: payment.idthanhtoan,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Add both notifications to result
      return {
        orders: [order],
        orderDetails,
        payments: [payment],
        deliverySchedules,
        notification,
        adminNotification,
      };
    });

    // Get user email to send confirmation
    const user = await prisma.users.findUnique({
      where: { idUsers: userId },
      select: { Email: true },
    });

    if (user?.Email) {
      try {
        // Get address details for the email
        let shippingAddress = {
          idDiaChi: addressId || 0,
          tenNguoiNhan: customerName || "Khách hàng",
          soDienThoai: "",
          diaChiChiTiet: "",
          phuongXa: "",
          quanHuyen: "",
          thanhPho: "",
        };

        if (addressId) {
          const address = await prisma.diaChi.findUnique({
            where: { idDiaChi: addressId },
          });

          if (address) {
            shippingAddress = address;
          }
        }

        // Get discount information if applicable
        let discountInfo = null;
        if (discountId) {
          const discount = await prisma.discountCode.findUnique({
            where: { idDiscount: discountId },
          });
          if (discount) {
            discountInfo = {
              code: discount.code,
              discountType: discount.discountType,
              value: Number(discount.value),
            };
          }
        }

        // Get complete product details with explicit type conversion
        const orderItems = await Promise.all(
          result.orderDetails.map(async (item) => {
            const product = await prisma.sanpham.findUnique({
              where: { idsanpham: item.idsanpham },
            });

            const size = item.idSize
              ? await prisma.size.findUnique({
                  where: { idSize: item.idSize },
                })
              : null;

            // Create properly typed order item
            return {
              idsanpham: Number(item.idsanpham),
              soluong: Number(item.soluong),
              dongia: Number(item.dongia),
              sanpham: {
                Tensanpham: product?.tensanpham || "Sản phẩm không xác định",
                hinhanh: product?.hinhanh || "",
                gia: Number(product?.gia || 0),
                // Convert Decimal to number explicitly
                giamgia: product?.giamgia ? Number(product.giamgia) : undefined,
              },
              size: size
                ? {
                    idSize: size.idSize,
                    tenSize: size.tenSize,
                  }
                : null,
            };
          })
        );

        // Get payment information
        const payment = result.payments[0];

        // Create properly typed order details
        const emailOrderDetails = {
          iddonhang: Number(result.orders[0].iddonhang),
          ngaydat: result.orders[0].ngaydat,
          tongsotien: Number(result.orders[0].tongsotien),
          tongsoluong: Number(result.orders[0].tongsoluong || 0),
          trangthai: result.orders[0].trangthai || null,
          discountValue: Number(result.orders[0].discountValue || 0),
          items: orderItems,
          paymentMethod,
          shippingAddress,
          discount: discountInfo,
          payment: {
            idthanhtoan: payment.idthanhtoan,
            phuongthucthanhtoan: payment.phuongthucthanhtoan,
            sotien: Number(payment.sotien),
            trangthai: payment.trangthai,
            ngaythanhtoan: payment.ngaythanhtoan,
          },
        };

        // Send confirmation email with properly typed data
        await sendOrderConfirmationEmail(user.Email, emailOrderDetails);
        console.log(`Order confirmation email sent to ${user.Email}`);
      } catch (emailError) {
        // Log error but don't fail the order process
        console.error("Error sending order confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order created successfully",
      originalTotal:
        Number(result.orders[0].tongsotien) +
        Number(result.orders[0].discountValue || 0),
      discountAmount: Number(result.orders[0].discountValue || 0),
      finalTotal: Number(result.orders[0].tongsotien),
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
        throw new Error(`Product with ID ${item.idsanpham} not found`);
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
  discountValue = 0,
  addressId: number | null = null // Added address ID parameter
) {
  // Ensure proper handling of discountId format
  let finalDiscountId: number | null = null;

  // Process discountId
  if (discountId !== null && discountId !== undefined) {
    // Convert to number if needed
    const parsedId =
      typeof discountId === "string"
        ? Number.parseInt(discountId, 10)
        : discountId;
    // Only use if it's a valid number greater than 0
    finalDiscountId = !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
  }

  console.log("createOrder - Prepared params:", {
    userId: userId,
    finalAmount: finalAmount,
    totalQuantity: totalQuantity,
    originalDiscountId: discountId,
    finalDiscountId: finalDiscountId,
    discountValue: discountValue,
    addressId: addressId,
  });

  try {
    // Create order with properly processed fields
    const orderData = {
      idUsers: userId,
      ngaydat: new Date(),
      trangthai: "Awaiting payment",
      tongsotien: finalAmount,
      tongsoluong: totalQuantity,
      idDiscount: finalDiscountId,
      discountValue: discountValue,
      idDiaChi: addressId, // Add address ID to order data
    };

    console.log("createOrder - Order data prepared:", orderData);

    const order = await prisma.donhang.create({
      data: orderData,
    });

    console.log("createOrder - Order created successfully:", {
      iddonhang: order.iddonhang,
      idDiscount: order.idDiscount,
      discountValue: order.discountValue,
      idDiaChi: order.idDiaChi,
    });

    return order;
  } catch (error) {
    console.error("createOrder - Error creating order:", error);
    throw error;
  }
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
        TrangThai: "Awaiting delivery",
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
          `Item with idgiohang ${item.idgiohang} may have already been deleted`
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

  let errorMessage = "Error processing order";
  let errorDetails = "";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    errorMessage = `Database error: ${error.message}`;
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

function getPaymentMethodText(method: string): string {
  switch (method) {
    case "stripe":
      return "Thẻ tín dụng/ghi nợ (Stripe)";
    case "online":
      return "Chuyển khoản ngân hàng";
    case "cash":
      return "Tiền mặt khi nhận hàng";
    default:
      return method;
  }
}

export async function GET(req: NextRequest) {
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
        discount: true, // Ensure discount information is retrieved
        diaChiGiaoHang: true, // Include address information
      },
      orderBy: { ngaydat: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
