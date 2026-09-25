import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentDetails } from '@/app/types/types';

export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, {
    timeout: 10000,
    maxNetworkRetries: 3,
    telemetry: false,
  } as ConstructorParameters<typeof Stripe>[1]);
}

export async function POST(request: Request) {
  try {
    const { orderId, amount, currency, description }: PaymentDetails = await request.json();

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        orderId: orderId.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Lỗi tạo phiên thanh toán' },
      { status: 500 }
    );
  }
}