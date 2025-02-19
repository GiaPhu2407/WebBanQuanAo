import { calculateDiscountedPrice } from "@/app/component/utils/price";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const MAX_VND_AMOUNT = 200000000; // 200 million VND

const validateTotalAmount = (cartItems: any[]) => {
  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.isSelected && item.sanpham)
      .reduce((total, item) => {
        const originalPrice = item.sanpham?.gia ?? 0;
        const discountPercent = item.sanpham?.giamgia ?? 0;
        const discountedPrice = calculateDiscountedPrice(
          originalPrice,
          discountPercent
        );
        return total + discountedPrice * item.soluong;
      }, 0);
  };

  if (calculateTotal() > MAX_VND_AMOUNT) {
    throw new Error(
      `Total amount (${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(
        calculateTotal()
      )}) exceeds maximum limit of ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(MAX_VND_AMOUNT)}`
    );
  }

  return calculateTotal();
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { cartItems } = await req.json();

    const totalAmount = validateTotalAmount(cartItems);
    const amountInUSD = Math.round((totalAmount / 24000) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInUSD,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.idUsers,
        cartItems: JSON.stringify(
          cartItems.map((item: any) => ({
            idGioHang: item.idGioHang,
            idsanpham: item.idsanpham,
            SoLuong: item.SoLuong,
            originalPrice: item.sanpham.gia,
          }))
        ),
        conversion_rate: "24000",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe payment error:", error);
    return NextResponse.json(
      { error: error.message || "Error creating payment" },
      { status: 500 }
    );
  }
}
