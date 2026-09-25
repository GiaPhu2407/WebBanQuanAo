import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, {
    apiVersion: '2025-01-27.acacia',
  });
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const body = await req.text();
  console.log("Raw Webhook Body:", body);
  const sig = headers().get('stripe-signature') || "";

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    try {
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