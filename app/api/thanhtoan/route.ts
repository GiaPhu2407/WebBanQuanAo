import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
// import { pusherServer } from "@/lib/pusher";

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
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems, stripeSessionId, paymentMethod } = body;

    if (!cartItems && !stripeSessionId) {
      return NextResponse.json(
        { error: "Cart items or stripeSessionId are required" },
        { status: 400 }
      );
    }

    const userId =
      typeof session.idUsers === "string"
        ? parseInt(session.idUsers, 10)
        : session.idUsers;

    // Handle Stripe payment initiation
    if (paymentMethod === "stripe" && !stripeSessionId) {
      return await handleStripePaymentInitiation(cartItems, userId);
    }

    // Handle Stripe payment completion
    if (stripeSessionId) {
      return await handleStripePaymentCompletion(
        stripeSessionId,
        userId,
        session.name,
        paymentMethod
      );
    }

    // Handle direct order processing
    if (cartItems && Array.isArray(cartItems)) {
      return await processOrder(cartItems, paymentMethod, userId, session.name);
    }

    return NextResponse.json(
      { error: "Invalid request parameters" },
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

async function handleStripePaymentInitiation(
  cartItems: CartItem[],
  userId: number
) {
  const lineItems = cartItems.map((item) => ({
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

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    metadata: {
      userId: userId.toString(),
      cartItems: JSON.stringify(cartItems),
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}

async function handleStripePaymentCompletion(
  stripeSessionId: string,
  userId: number,
  customerName: string,
  paymentMethod: string
) {
  const existingPayment = await prisma.thanhtoan.findFirst({
    where: { trangthai: `STRIPE:${stripeSessionId}` },
  });

  if (existingPayment) {
    return NextResponse.json({
      success: true,
      message: "Payment already processed",
      data: { existingPayment },
    });
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(stripeSessionId);
  if (!paymentIntent.metadata?.cartItems) {
    throw new Error("No cart items found in payment metadata");
  }

  const parsedCartItems = JSON.parse(paymentIntent.metadata.cartItems);
  return await processOrder(
    parsedCartItems,
    paymentMethod || "stripe",
    userId,
    customerName,
    stripeSessionId
  );
}

async function processOrder(
  cartItems: CartItem[],
  paymentMethod: string,
  userId: number,
  customerName: string,
  stripeSessionId?: string
): Promise<NextResponse> {
  if (!Array.isArray(cartItems)) {
    return NextResponse.json(
      { error: "Invalid cart items data" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction<OrderData>(async (prisma) => {
      const cartItemsWithDetails = await getCartItemsWithDetails(
        prisma,
        cartItems
      );
      const { totalAmount, totalQuantity } =
        calculateOrderTotals(cartItemsWithDetails);

      const order = await createOrder(
        prisma,
        userId,
        totalAmount,
        totalQuantity
      );
      await notifyNewOrder(order, totalAmount, customerName, paymentMethod);

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
      const payment = await createPayment(
        prisma,
        order.iddonhang,
        totalAmount,
        paymentMethod,
        stripeSessionId
      );

      await clearCart(prisma, cartItems);

      return {
        orders: [order],
        orderDetails,
        payments: [payment],
        deliverySchedules,
      };
    });

    return NextResponse.json({ success: true, data: result });
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
  totalAmount: number,
  totalQuantity: number
) {
  return await prisma.donhang.create({
    data: {
      idUsers: userId,
      ngaydat: new Date(),
      trangthai: "Chờ xác nhận",
      tongsotien: totalAmount,
      tongsoluong: totalQuantity,
    },
  });
}

async function notifyNewOrder(
  order: any,
  totalAmount: number,
  customerName: string,
  paymentMethod: string
) {
  // await pusherServer.trigger("admin-channel", "new-order", {
  //   type: "order",
  //   title: "Đơn hàng mới",
  //   message: `Có đơn hàng mới #${order.iddonhang}`,
  //   data: {
  //     orderId: order.iddonhang,
  //     totalAmount,
  //     customerName,
  //     orderDate: order.ngaydat,
  //     paymentMethod,
  //     status: order.trangthai,
  //   },
  //   timestamp: new Date().toISOString(),
  // });
}

async function createOrderDetails(
  prisma: any,
  orderId: number,
  cartItems: CartItem[]
) {
  const orderDetails = [];
  for (const item of cartItems) {
    if (!item.idsanpham || !item.soluong || !item.sanpham?.gia) {
      console.error("Invalid item data:", item);
      continue;
    }

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

async function createPayment(
  prisma: any,
  orderId: number,
  totalAmount: number,
  paymentMethod: string,
  stripeSessionId?: string
) {
  return await prisma.thanhtoan.create({
    data: {
      iddonhang: orderId,
      phuongthucthanhtoan: paymentMethod,
      sotien: totalAmount,
      trangthai: stripeSessionId ? `STRIPE:${stripeSessionId}` : "Đang xử lý",
      ngaythanhtoan: new Date(),
    },
  });
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
          `Item with idgiohang ${item.idgiohang} might have been already deleted`
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
