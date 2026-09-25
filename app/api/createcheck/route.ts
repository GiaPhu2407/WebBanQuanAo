import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentDetails } from '@/app/types/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    timeout: 10000, // timeout in ms
    maxNetworkRetries: 3,
    telemetry: false // disable telemetry
  });
export async function POST(request: Request) {
  try {
    const { orderId, amount, currency, description }: PaymentDetails = await request.json();

    const session = await stripe.checkout.sessions.create({
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