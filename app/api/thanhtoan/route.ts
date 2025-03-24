import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { request } from "http";
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
  notification?: any; // Add this line
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req); // Fix: use req instead of request
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems, stripeSessionId, paymentMethod, imageURL, orderId } =
      body;

    const userId =
      typeof session.idUsers === "string"
        ? parseInt(session.idUsers, 10)
        : session.idUsers;

    // Handle payment proof submission
    if (imageURL && orderId) {
      const orderIdNumber = parseInt(orderId);
      const totalAmount = cartItems.reduce(
        (total: number, item: any) => total + item.sanpham.gia * item.soluong,
        0
      );

      const payment = await prisma.thanhtoan.create({
        data: {
          iddonhang: orderIdNumber,
          phuongthucthanhtoan: paymentMethod,
          sotien: totalAmount,
          trangthai: "Chờ xác nhận",
          ngaythanhtoan: new Date(),
          hinhanhthanhtoan: imageURL,
        },
      });

      await prisma.donhang.update({
        where: { iddonhang: orderIdNumber },
        data: { trangthai: "Chờ xác nhận thanh toán" },
      });

      // Create notification
      const notification = await prisma.notification.create({
        data: {
          idUsers: userId,
          title: "Thanh toán mới",
          message: `Thanh toán cho đơn hàng #${orderIdNumber} đã được xác nhận`,
          type: "payment",
          idDonhang: orderIdNumber,
          idThanhtoan: payment.idthanhtoan,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Trigger real-time notification
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
    }
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
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error during payment processing" },
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

      // Create notification
      const notification = await prisma.notification.create({
        data: {
          idUsers: userId,
          title: "Thanh toán mới",
          message: `Thanh toán cho đơn hàng #${order.iddonhang} đã được xác nhận`,
          type: "payment",
          idDonhang: order.iddonhang,
          idThanhtoan: payment.idthanhtoan,
          isRead: false,
          createdAt: new Date(),
        },
      });

      // Return the notification with the transaction result
      return {
        orders: [order],
        orderDetails,
        payments: [payment],
        deliverySchedules,
        notification,
      };
    });

    // Trigger real-time notification after transaction
    if (result.notification) {
      await pusherServer.trigger(
        "notifications",
        "new-notification",
        result.notification
      );
    }

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
    const session = await getSession(request);
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

// import { NextResponse } from "next/server";
// import { getSession } from "@/lib/auth";
// import prisma from "@/prisma/client";
// import Stripe from "stripe";
// import { Prisma } from "@prisma/client";
// import { pusherServer } from "@/lib/pusher";
// import { request } from "http";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-01-27.acacia",
// });

// interface CartItem {
//   idsanpham: number;
//   soluong: number;
//   idSize?: number;
//   idgiohang?: number;
//   sanpham: {
//     gia: number;
//     Tensanpham: string;
//     hinhanh: string;
//   };
// }

// interface OrderData {
//   orders: any[];
//   orderDetails: any[];
//   payments: any[];
//   deliverySchedules: any[];
//   notification?: any;
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getSession(req);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { cartItems, stripeSessionId, paymentMethod, imageURL, orderId } =
//       body;

//     const userId =
//       typeof session.idUsers === "string"
//         ? parseInt(session.idUsers, 10)
//         : session.idUsers;
//         if (paymentMethod === "tiền mặt" && orderId) {
//           try {
//             const orderIdNumber = parseInt(orderId);
//             const order = await prisma.donhang.findUnique({
//               where: { iddonhang: orderIdNumber },
//               include: {
//                 chitietdonhang: {
//                   include: {
//                     sanpham: true,
//                   },
//                 },
//                 thanhtoan: true, // Check if payment already exists
//               },
//             });

//             if (!order) {
//               return NextResponse.json(
//                 { error: "Đơn hàng không tồn tại" },
//                 { status: 404 }
//               );
//             }

//             // Calculate total from order details
//             const totalAmount =
//               order.tongsotien ||
//               order.chitietdonhang.reduce(
//                 (total: number, item: any) => total + item.dongia * item.soluong,
//                 0
//               );

//             // Check if payment already exists
//             if (order.thanhtoan && order.thanhtoan.length > 0) {
//               // Update existing payment instead of creating a new one
//               const existingPayment = order.thanhtoan[0];
//               const payment = await prisma.thanhtoan.update({
//                 where: { idthanhtoan: existingPayment.idthanhtoan },
//                 data: {
//                   phuongthucthanhtoan: "tiền mặt",
//                   sotien: totalAmount,
//                   trangthai: "Chờ xác nhận",
//                   ngaythanhtoan: new Date(),
//                   hinhanhthanhtoan: imageURL || null,
//                 },
//               });

//               // Update order status
//               await prisma.donhang.update({
//                 where: { iddonhang: orderIdNumber },
//                 data: { trangthai: "Chờ xác nhận thanh toán" },
//               });

//               // Create notification
//               const notification = await prisma.notification.create({
//                 data: {
//                   idUsers: userId,
//                   title: "Thanh toán tiền mặt",
//                   message: `Thanh toán tiền mặt cho đơn hàng #${orderIdNumber} đã được ghi nhận và đang chờ xác nhận`,
//                   type: "payment",
//                   idDonhang: orderIdNumber,
//                   idThanhtoan: payment.idthanhtoan,
//                   isRead: false,
//                   createdAt: new Date(),
//                 },
//               });

//               // Send real-time notification
//               await pusherServer.trigger(
//                 "notifications",
//                 "new-notification",
//                 notification
//               );

//               return NextResponse.json({
//                 success: true,
//                 message: "Thanh toán tiền mặt đã được ghi nhận",
//                 payment,
//               });
//             } else {
//               // Create payment record for cash payment
//               const payment = await prisma.thanhtoan.create({
//                 data: {
//                   iddonhang: orderIdNumber,
//                   phuongthucthanhtoan: "tiền mặt",
//                   sotien: totalAmount,
//                   trangthai: "Chờ xác nhận",
//                   ngaythanhtoan: new Date(),
//                   hinhanhthanhtoan: imageURL || null,
//                 },
//               });

//               // Update order status
//               await prisma.donhang.update({
//                 where: { iddonhang: orderIdNumber },
//                 data: { trangthai: "Chờ xác nhận thanh toán" },
//               });

//               // Create notification
//               const notification = await prisma.notification.create({
//                 data: {
//                   idUsers: userId,
//                   title: "Thanh toán tiền mặt",
//                   message: `Thanh toán tiền mặt cho đơn hàng #${orderIdNumber} đã được ghi nhận và đang chờ xác nhận`,
//                   type: "payment",
//                   idDonhang: orderIdNumber,
//                   idThanhtoan: payment.idthanhtoan,
//                   isRead: false,
//                   createdAt: new Date(),
//                 },
//               });

//               // Send real-time notification
//               await pusherServer.trigger(
//                 "notifications",
//                 "new-notification",
//                 notification
//               );

//               return NextResponse.json({
//                 success: true,
//                 message: "Thanh toán tiền mặt đã được ghi nhận",
//                 payment,
//               });
//             }
//           } catch (error) {
//             console.error("Error processing cash payment:", error);
//             return NextResponse.json(
//               { error: "Lỗi khi xử lý thanh toán tiền mặt" },
//               { status: 500 }
//             );
//           }
//         }
//     // Handle payment proof submission
//     if (imageURL && orderId) {
//       try {
//         const orderIdNumber = parseInt(orderId);
//         const order = await prisma.donhang.findUnique({
//           where: { iddonhang: orderIdNumber },
//           include: {
//             chitietdonhang: {
//               include: {
//                 sanpham: true,
//               },
//             },
//           },
//         });

//         if (!order) {
//           throw new Error("Order not found");
//         }

//         const totalAmount = cartItems.reduce(
//           (total: number, item: any) => total + item.sanpham.gia * item.soluong,
//           0
//         );

//         const payment = await prisma.thanhtoan.create({
//           data: {
//             iddonhang: orderIdNumber,
//             phuongthucthanhtoan: paymentMethod,
//             sotien: totalAmount,
//             trangthai: "Chờ xác nhận",
//             ngaythanhtoan: new Date(),
//             hinhanhthanhtoan: imageURL,
//           },
//         });

//         await prisma.donhang.update({
//           where: { iddonhang: orderIdNumber },
//           data: { trangthai: "Chờ xác nhận thanh toán" },
//         });

//         // Clear cart items after successful payment
//         if (cartItems && Array.isArray(cartItems)) {
//           await Promise.all(
//             cartItems.map(async (item) => {
//               if (item.idgiohang) {
//                 await prisma.giohang.delete({
//                   where: { idgiohang: item.idgiohang },
//                 });
//               }
//             })
//           );
//         }

//         const notification = await prisma.notification.create({
//           data: {
//             idUsers: userId,
//             title: "Thanh toán mới",
//             message: `Thanh toán cho đơn hàng #${orderIdNumber} đã được gửi và đang chờ xác nhận`,
//             type: "payment",
//             idDonhang: orderIdNumber,
//             idThanhtoan: payment.idthanhtoan,
//             isRead: false,
//             createdAt: new Date(),
//           },
//         });

//         await pusherServer.trigger(
//           "notifications",
//           "new-notification",
//           notification
//         );

//         return NextResponse.json({
//           success: true,
//           message: "Đã cập nhật chứng từ thanh toán",
//           payment,
//         });
//       } catch (error) {
//         console.error("Error processing payment proof:", error);
//         return NextResponse.json(
//           { error: "Failed to process payment proof" },
//           { status: 500 }
//         );
//       }
//     }

//     // Handle new order creation
//     if (!Array.isArray(cartItems) || cartItems.length === 0) {
//       return NextResponse.json(
//         { error: "Invalid cart items" },
//         { status: 400 }
//       );
//     }

//     try {
//       // Calculate totals
//       const totalAmount = cartItems.reduce(
//         (sum, item: CartItem) => sum + item.sanpham.gia * item.soluong,
//         0
//       );

//       const totalQuantity = cartItems.reduce(
//         (sum, item: CartItem) => sum + item.soluong,
//         0
//       );

//       // Create order
//       const order = await prisma.donhang.create({
//         data: {
//           idUsers: userId,
//           ngaydat: new Date(),
//           trangthai: "Chờ thanh toán",
//           tongsotien: totalAmount,
//           tongsoluong: totalQuantity,
//         },
//       });

//       // Create order details
//       const orderDetails = await Promise.all(
//         cartItems.map((item: CartItem) =>
//           prisma.chitietDonhang.create({
//             data: {
//               iddonhang: order.iddonhang,
//               idsanpham: item.idsanpham,
//               idSize: item.idSize,
//               soluong: item.soluong,
//               dongia: item.sanpham.gia,
//             },
//           })
//         )
//       );

//       // Create delivery schedules
//       const deliveryDate = new Date();
//       deliveryDate.setDate(deliveryDate.getDate() + 3);

//       await Promise.all(
//         cartItems.map((item: CartItem) =>
//           prisma.lichGiaoHang.create({
//             data: {
//               iddonhang: order.iddonhang,
//               idsanpham: item.idsanpham,
//               idKhachHang: userId,
//               NgayGiao: deliveryDate,
//               TrangThai: "Chờ giao",
//             },
//           })
//         )
//       );

//       // Clear cart - Ensure this happens after successful order creation
//       await Promise.all(
//         cartItems.map((item: CartItem) =>
//           prisma.giohang.delete({
//             where: { idgiohang: item.idgiohang },
//           })
//         )
//       );

//       // Create notification
//       const notification = await prisma.notification.create({
//         data: {
//           idUsers: userId,
//           title: "Đơn hàng mới",
//           message: `Đơn hàng #${order.iddonhang} đã được tạo thành công`,
//           type: "order",
//           idDonhang: order.iddonhang,
//           isRead: false,
//           createdAt: new Date(),
//         },
//       });

//       await pusherServer.trigger(
//         "notifications",
//         "new-notification",
//         notification
//       );

//       return NextResponse.json({
//         success: true,
//         data: {
//           donhang: order,
//           chitietDonhang: orderDetails,
//         },
//       });
//     } catch (error) {
//       console.error("Error creating order:", error);
//       return NextResponse.json(
//         { error: "Failed to create order" },
//         { status: 500 }
//       );
//     }

//     // Handle Stripe payment initiation
//     if (paymentMethod === "stripe" && !stripeSessionId) {
//       return await handleStripePaymentInitiation(cartItems, userId);
//     }

//     // Handle Stripe payment completion
//     if (stripeSessionId) {
//       return await handleStripePaymentCompletion(
//         stripeSessionId,
//         userId,
//         session.name,
//         paymentMethod,
//         cartItems // Pass cartItems to ensure they can be cleared
//       );
//     }

//     // Handle direct order processing
//     if (cartItems && Array.isArray(cartItems)) {
//       return await processOrder(cartItems, paymentMethod, userId, session.name);
//     }

//     return NextResponse.json(
//       { error: "Invalid request parameters" },
//       { status: 400 }
//     );
//   } catch (error) {
//     console.error("Payment error:", error);
//     return NextResponse.json(
//       { error: "Internal server error during payment processing" },
//       { status: 500 }
//     );
//   }
// }

// async function handleStripePaymentInitiation(
//   cartItems: CartItem[],
//   userId: number
// ) {
//   const lineItems = cartItems.map((item) => ({
//     price_data: {
//       currency: "vnd",
//       product_data: {
//         name: item.sanpham.Tensanpham,
//         images: [item.sanpham.hinhanh],
//       },
//       unit_amount: item.sanpham.gia,
//     },
//     quantity: item.soluong,
//   }));

//   const stripeSession = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
//     metadata: {
//       userId: userId.toString(),
//       cartItems: JSON.stringify(cartItems),
//     },
//   });

//   return NextResponse.json({ url: stripeSession.url });
// }

// async function handleStripePaymentCompletion(
//   stripeSessionId: string,
//   userId: number,
//   customerName: string,
//   paymentMethod: string,
//   cartItems: CartItem[] // Add cartItems parameter
// ) {
//   const existingPayment = await prisma.thanhtoan.findFirst({
//     where: { trangthai: `STRIPE:${stripeSessionId}` },
//   });

//   if (existingPayment) {
//     return NextResponse.json({
//       success: true,
//       message: "Payment already processed",
//       data: { existingPayment },
//     });
//   }

//   const paymentIntent = await stripe.paymentIntents.retrieve(stripeSessionId);
//   if (!paymentIntent.metadata?.cartItems) {
//     throw new Error("No cart items found in payment metadata");
//   }

//   const parsedCartItems = JSON.parse(paymentIntent.metadata.cartItems);

//   // Clear cart items after successful Stripe payment
//   if (cartItems && Array.isArray(cartItems)) {
//     await Promise.all(
//       cartItems.map(async (item) => {
//         if (item.idgiohang) {
//           await prisma.giohang.delete({
//             where: { idgiohang: item.idgiohang },
//           });
//         }
//       })
//     );
//   }

//   return await processOrder(
//     parsedCartItems,
//     paymentMethod || "stripe",
//     userId,
//     customerName,
//     stripeSessionId
//   );
// }

// async function processOrder(
//   cartItems: CartItem[],
//   paymentMethod: string,
//   userId: number,
//   customerName: string,
//   stripeSessionId?: string
// ): Promise<NextResponse> {
//   if (!Array.isArray(cartItems)) {
//     return NextResponse.json(
//       { error: "Invalid cart items data" },
//       { status: 400 }
//     );
//   }

//   try {
//     const result = await prisma.$transaction<OrderData>(async (prisma) => {
//       const cartItemsWithDetails = await getCartItemsWithDetails(
//         prisma,
//         cartItems
//       );
//       const { totalAmount, totalQuantity } =
//         calculateOrderTotals(cartItemsWithDetails);

//       const order = await createOrder(
//         prisma,
//         userId,
//         totalAmount,
//         totalQuantity
//       );
//       const orderDetails = await createOrderDetails(
//         prisma,
//         order.iddonhang,
//         cartItemsWithDetails
//       );
//       const deliverySchedules = await createDeliverySchedules(
//         prisma,
//         order.iddonhang,
//         cartItemsWithDetails,
//         userId
//       );
//       const payment = await createPayment(
//         prisma,
//         order.iddonhang,
//         totalAmount,
//         paymentMethod,
//         stripeSessionId
//       );

//       // Ensure cart is cleared after successful order processing
//       await clearCart(prisma, cartItems);

//       // Create notification
//       const notification = await prisma.notification.create({
//         data: {
//           idUsers: userId,
//           title: "Thanh toán mới",
//           message: `Thanh toán cho đơn hàng #${order.iddonhang} đã được xác nhận`,
//           type: "payment",
//           idDonhang: order.iddonhang,
//           idThanhtoan: payment.idthanhtoan,
//           isRead: false,
//           createdAt: new Date(),
//         },
//       });

//       return {
//         orders: [order],
//         orderDetails,
//         payments: [payment],
//         deliverySchedules,
//         notification,
//       };
//     });

//     // Trigger real-time notification after transaction
//     if (result.notification) {
//       await pusherServer.trigger(
//         "notifications",
//         "new-notification",
//         result.notification
//       );
//     }

//     return NextResponse.json({ success: true, data: result });
//   } catch (error) {
//     return handleProcessOrderError(error);
//   }
// }

// async function getCartItemsWithDetails(prisma: any, cartItems: CartItem[]) {
//   return await Promise.all(
//     cartItems.map(async (item) => {
//       const product = await prisma.sanpham.findUnique({
//         where: { idsanpham: item.idsanpham },
//       });

//       if (!product) {
//         throw new Error(`Product with ID ${item.idsanpham} not found`);
//       }

//       return { ...item, sanpham: product };
//     })
//   );
// }

// function calculateOrderTotals(cartItems: CartItem[]) {
//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + Number(item.sanpham.gia) * item.soluong,
//     0
//   );
//   const totalQuantity = cartItems.reduce((sum, item) => sum + item.soluong, 0);
//   return { totalAmount, totalQuantity };
// }

// async function createOrder(
//   prisma: any,
//   userId: number,
//   totalAmount: number,
//   totalQuantity: number
// ) {
//   return await prisma.donhang.create({
//     data: {
//       idUsers: userId,
//       ngaydat: new Date(),
//       trangthai: "Chờ xác nhận",
//       tongsotien: totalAmount,
//       tongsoluong: totalQuantity,
//     },
//   });
// }

// async function createOrderDetails(
//   prisma: any,
//   orderId: number,
//   cartItems: CartItem[]
// ) {
//   const orderDetails = [];
//   for (const item of cartItems) {
//     if (!item.idsanpham || !item.soluong || !item.sanpham?.gia) {
//       console.error("Invalid item data:", item);
//       continue;
//     }

//     const orderDetail = await prisma.chitietDonhang.create({
//       data: {
//         iddonhang: orderId,
//         idsanpham: item.idsanpham,
//         idSize: item.idSize,
//         soluong: item.soluong,
//         dongia: Number(item.sanpham.gia),
//       },
//     });
//     orderDetails.push(orderDetail);
//   }
//   return orderDetails;
// }

// async function createDeliverySchedules(
//   prisma: any,
//   orderId: number,
//   cartItems: CartItem[],
//   userId: number
// ) {
//   const deliverySchedules = [];
//   for (const item of cartItems) {
//     const deliverySchedule = await prisma.lichGiaoHang.create({
//       data: {
//         iddonhang: orderId,
//         idsanpham: item.idsanpham,
//         idKhachHang: userId,
//         NgayGiao: calculateDeliveryDate(),
//         TrangThai: "Chờ giao",
//       },
//     });
//     deliverySchedules.push(deliverySchedule);
//   }
//   return deliverySchedules;
// }

// async function createPayment(
//   prisma: any,
//   orderId: number,
//   totalAmount: number,
//   paymentMethod: string,
//   stripeSessionId?: string
// ) {
//   return await prisma.thanhtoan.create({
//     data: {
//       iddonhang: orderId,
//       phuongthucthanhtoan: paymentMethod,
//       sotien: totalAmount,
//       trangthai: stripeSessionId ? `STRIPE:${stripeSessionId}` : "Đang xử lý",
//       ngaythanhtoan: new Date(),
//     },
//   });
// }

// async function clearCart(prisma: any, cartItems: CartItem[]) {
//   for (const item of cartItems) {
//     if (item.idgiohang) {
//       try {
//         await prisma.giohang.delete({
//           where: { idgiohang: item.idgiohang },
//         });
//       } catch (err) {
//         console.warn(
//           `Item with idgiohang ${item.idgiohang} might have been already deleted`
//         );
//       }
//     }
//   }
// }

// function calculateDeliveryDate(): Date {
//   const orderDate = new Date();
//   const earliestDeliveryDate = new Date(orderDate);
//   earliestDeliveryDate.setDate(orderDate.getDate() + 3);

//   const maxDeliveryDate = new Date(orderDate);
//   maxDeliveryDate.setDate(orderDate.getDate() + 6);

//   const deliveryDate = new Date(
//     earliestDeliveryDate.getTime() +
//       Math.random() *
//         (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
//   );

//   deliveryDate.setHours(
//     8 + Math.floor(Math.random() * 10),
//     Math.floor(Math.random() * 60),
//     0,
//     0
//   );
//   return deliveryDate;
// }

// function handleProcessOrderError(error: any) {
//   console.error("Transaction error:", error);

//   let errorMessage = "Error processing order";
//   let errorDetails = "";

//   if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     errorMessage = `Database error: ${error.message}`;
//     errorDetails = JSON.stringify({
//       code: error.code,
//       meta: error.meta,
//       model: (error.meta as any)?.modelName || "unknown",
//     });
//   } else if (error instanceof Error) {
//     errorMessage = error.message;
//     errorDetails = error.stack || "";
//   }

//   return NextResponse.json(
//     {
//       error: errorMessage,
//       details: errorDetails,
//     },
//     { status: 500 }
//   );
// }

// export async function GET(req: Request) {
//   try {
//     const session = await getSession(request);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const orders = await prisma.donhang.findMany({
//       where: { idUsers: session.idUsers },
//       include: {
//         chitietdonhang: {
//           include: {
//             sanpham: true,
//           },
//         },
//         thanhtoan: true,
//         lichgiaohang: true,
//       },
//       orderBy: { ngaydat: "desc" },
//     });

//     return NextResponse.json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
