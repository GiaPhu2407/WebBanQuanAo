// import { NextResponse } from 'next/server';
// import Stripe from 'stripe'; 
// import { StripeWebhookEvent } from '@/app/types/types';
// import prisma from '@/prisma/client';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     timeout: 10000, // timeout in ms
//     maxNetworkRetries: 3,
//     telemetry: false // disable telemetry
//   });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
//   const orderId = parseInt(session.metadata?.orderId || '0');

//   await prisma.thanhtoan.create({
//     data: {
//       iddonhang: orderId,
//       phuongthucthanhtoan: 'Stripe',
//       sotien: session.amount_total! / 100,
//       trangthai: 'Đã thanh toán',
//       ngaythanhtoan: new Date(),
//       stripe_session_id: session.id,
//       stripe_payment_intent_id: session.payment_intent as string,
//       stripe_payment_status: session.payment_status,
//     },
//   });

//   await prisma.donhang.update({
//     where: { iddonhang: orderId },
//     data: { trangthai: 'Đã thanh toán' },
//   });
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.text();
//     const signature = request.headers.get('stripe-signature')!;

//     const event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       webhookSecret
//     ) as StripeWebhookEvent;

//     switch (event.type) {
//       case 'checkout.session.completed':
//         await handleCheckoutComplete(event.data.object);
//         break;
//       // Thêm các case khác nếu cần
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error('Webhook error:', error);
//     return NextResponse.json(
//       { error: 'Lỗi xử lý webhook' },
//       { status: 400 }
//     );
//   }
// }