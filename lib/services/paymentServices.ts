import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/cart";

export async function createStripeSession(userId: number, cartItems: CartItem[]) {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.sanpham.tensanpham,
          images: [item.sanpham.hinhanh],
        },
        // Convert to smallest currency unit for Stripe (1 VND)
        unit_amount: Math.floor(item.sanpham.gia),
      },
      quantity: item.soluong,
    }));
  
    return await stripe.checkout.sessions.create({
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
  }