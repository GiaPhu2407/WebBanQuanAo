import { calculateDiscountedPrice } from "@/app/component/utils/price";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// force-dynamic: tránh Next.js cố gắng render static lúc build
export const dynamic = "force-dynamic";

// Lazy init — KHÔNG khởi tạo ở module level để tránh crash khi Vercel build thiếu env
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    apiVersion: "2025-01-27.acacia",
  });
}

const MAX_VND_AMOUNT = 200000000; // 200 million VND
const MIN_VND_AMOUNT = 12000; // Minimum amount in VND (equivalent to $0.50 USD)
const VND_TO_USD_RATE = 24000;

interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  isSelected: boolean;
  sanpham: {
    gia: number;
    giamgia?: number;
    Tensanpham: string;
    hinhanh: string;
  };
}

const calculateTotal = (cartItems: CartItem[]) => {
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

const validateAmount = (amount: number) => {
  if (amount < MIN_VND_AMOUNT) {
    throw new Error(
      `Amount must be at least ${MIN_VND_AMOUNT.toLocaleString("vi-VN")} VND`
    );
  }
  if (amount > MAX_VND_AMOUNT) {
    throw new Error(
      `Amount cannot exceed ${MAX_VND_AMOUNT.toLocaleString("vi-VN")} VND`
    );
  }
  return true;
};

const convertVNDtoUSD = (amount: number) => {
  return Math.max(Math.round((amount / VND_TO_USD_RATE) * 100), 50);
};

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty cart items" },
        { status: 400 }
      );
    }

    const totalAmount = calculateTotal(cartItems);

    try {
      validateAmount(totalAmount);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid amount";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const amountInUSD = convertVNDtoUSD(totalAmount);

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInUSD,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.idUsers,
        cartItems: JSON.stringify(
          cartItems.map((item: CartItem) => ({
            idgiohang: item.idgiohang,
            idsanpham: item.idsanpham,
            soluong: item.soluong,
            price: item.sanpham.gia,
            name: item.sanpham.Tensanpham,
          }))
        ),
        totalAmountVND: totalAmount.toString(),
        conversionRate: VND_TO_USD_RATE.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      amountUSD: amountInUSD / 100,
    });
  } catch (error: unknown) {
    console.error("Stripe payment error:", error);

    const stripeError = error as { type?: string; message?: string; statusCode?: number };
    const errorMessage =
      stripeError.type === "StripeInvalidRequestError"
        ? "Invalid payment request. Please check your payment details."
        : stripeError.message || "An error occurred while processing your payment";

    return NextResponse.json(
      { error: errorMessage },
      { status: stripeError.statusCode || 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
