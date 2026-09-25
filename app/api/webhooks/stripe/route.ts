import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  console.log("Raw Webhook Body:", body);
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    try {
      // Process the successful payment
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/thanhtoan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripePaymentIntentId: paymentIntent.id,
          paymentMethod: 'STRIPE',
          metadata: paymentIntent.metadata,
        }),
      });
    } catch (error) {
      console.error('Error processing payment success:', error);
      return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}