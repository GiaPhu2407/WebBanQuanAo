import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received body:", body);

    const { cartItems, stripeSessionId, paymentMethod } = body;

    if (!cartItems && !stripeSessionId) {
      return NextResponse.json(
        { error: "Cart items or stripeSessionId are required" },
        { status: 400 }
      );
    }

    if (paymentMethod === "stripe" && !stripeSessionId) {
      const lineItems = cartItems.map((item: any) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            Tensanpham: item.sanpham.Tensanpham,
            hinhanh: [item.sanpham.hinhanh],
          },
          unit_amount: item.sanpham.gia,
        },
        quantity: item.soluong,
      }));

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        metadata: {
          userId: session.idUsers.toString(),
          cartItems: JSON.stringify(cartItems),
        },
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    if (stripeSessionId && !cartItems) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          stripeSessionId
        );
        console.log("Retrieved payment intent:", paymentIntent);

        const existingPayment = await prisma.thanhtoan.findFirst({
          where: {
            trangthai: `STRIPE:${stripeSessionId}`,
          },
        });

        if (existingPayment) {
          console.log(
            "Payment already processed for this payment intent:",
            existingPayment
          );
          return NextResponse.json({
            success: true,
            message: "Payment already processed",
            data: { existingPayment },
          });
        }

        if (paymentIntent.metadata?.cartItems) {
          const parsedCartItems = JSON.parse(paymentIntent.metadata.cartItems);
          console.log("Parsed cart items from metadata:", parsedCartItems);

          const userId =
            typeof session.idUsers === "string"
              ? parseInt(session.idUsers, 10)
              : session.idUsers;
          return await processOrder(
            parsedCartItems,
            paymentMethod || "stripe",
            userId,
            stripeSessionId
          );
        } else {
          console.error(
            "No cart items found in payment intent metadata:",
            paymentIntent.metadata
          );
          throw new Error("No cart items found in payment metadata");
        }
      } catch (error) {
        console.error("Error retrieving or processing payment intent:", error);
        return NextResponse.json(
          {
            error: "Failed to retrieve or process payment details",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    }

    if (cartItems && Array.isArray(cartItems)) {
      const userId =
        typeof session.idUsers === "string"
          ? parseInt(session.idUsers, 10)
          : session.idUsers;
      return await processOrder(cartItems, paymentMethod, userId);
    }

    return NextResponse.json(
      {
        error: "Invalid request: either stripeSessionId or cartItems required",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during checkout",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function processOrder(
  cartItems: any[],
  paymentMethod: string,
  userId: number,
  stripeSessionId?: string
) {
  if (!Array.isArray(cartItems)) {
    console.error("cartItems is not an array:", cartItems);
    return NextResponse.json(
      { error: "Invalid cart items data" },
      { status: 400 }
    );
  }

  try {
    if (stripeSessionId) {
      const existingPayment = await prisma.thanhtoan.findFirst({
        where: {
          trangthai: `STRIPE:${stripeSessionId}`,
        },
        include: {
          donhang: true,
        },
      });

      if (existingPayment) {
        console.log(
          "Found existing payment for this session:",
          existingPayment
        );
        return NextResponse.json({
          success: true,
          message: "Payment already processed",
          data: { existingPayment },
        });
      }
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Fetch full product details for each cart item first
      const cartItemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await prisma.sanpham.findUnique({
            where: { idsanpham: item.idsanpham },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.idsanpham} not found`);
          }

          return {
            ...item,
            sanpham: product,
          };
        })
      );

      const allOrders = [];
      const allPayments = [];
      const allDeliverySchedules = [];
      const allOrderDetails = [];

      const totalAmount = cartItemsWithDetails.reduce((sum, item) => {
        return sum + Number(item.sanpham.gia) * item.soluong;
      }, 0);

      const totalQuantity = cartItemsWithDetails.reduce((sum, item) => {
        return sum + item.soluong;
      }, 0);

      const order = await prisma.donhang.create({
        data: {
          idUsers: userId,
          ngaydat: new Date(),
          trangthai: "Chờ xác nhận",
          tongsotien: totalAmount,
          tongsoluong: totalQuantity,
        },
      });
      allOrders.push(order);

      for (const item of cartItemsWithDetails) {
        try {
          if (!item.idsanpham || !item.soluong || !item.sanpham?.gia) {
            console.error("Invalid item data:", item);
            continue;
          }

          const orderDetail = await prisma.chitietDonhang.create({
            data: {
              iddonhang: order.iddonhang,
              idsanpham: item.idsanpham,
              idSize: item.idSize,
              soluong: item.soluong,
              dongia: Number(item.sanpham.gia),
            },
          });
          allOrderDetails.push(orderDetail);

          const deliverySchedule = await prisma.lichGiaoHang.create({
            data: {
              iddonhang: order.iddonhang,
              idsanpham: item.idsanpham,
              idKhachHang: userId,
              NgayGiao: await calculateDeliveryDate(),
              TrangThai: "Chờ giao",
            },
          });
          allDeliverySchedules.push(deliverySchedule);
        } catch (itemError) {
          console.error(
            `Error processing item with idsanpham ${item.idsanpham}:`,
            itemError
          );
          throw itemError;
        }
      }

      const payment = await prisma.thanhtoan.create({
        data: {
          iddonhang: order.iddonhang,
          phuongthucthanhtoan: paymentMethod,
          sotien: totalAmount,
          trangthai: stripeSessionId
            ? `STRIPE:${stripeSessionId}`
            : "Đang xử lý",
          ngaythanhtoan: new Date(),
        },
      });
      allPayments.push(payment);

      for (const item of cartItems) {
        if (item.idgiohang) {
          try {
            await prisma.giohang.delete({
              where: {
                idgiohang: item.idgiohang,
              },
            });
          } catch (err) {
            console.warn(
              `Item with idgiohang ${item.idgiohang} might have been already deleted`
            );
          }
        }
      }

      return {
        orders: allOrders,
        orderDetails: allOrderDetails,
        payments: allPayments,
        deliverySchedules: allDeliverySchedules,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (txError) {
    console.error("Transaction error:", txError);

    let errorMessage = "Error processing order";
    let errorDetails = "";

    if (txError instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${txError.message}`;
      errorDetails = JSON.stringify({
        code: txError.code,
        meta: txError.meta,
        model: (txError.meta as any)?.modelName || "unknown",
      });
    } else if (txError instanceof Error) {
      errorMessage = txError.message;
      errorDetails = txError.stack || "";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
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

export async function GET(req: Request) {
  try {
    const session = await getSession();
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
