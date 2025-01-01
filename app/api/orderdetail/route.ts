import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    const payment = await prisma.thanhtoan.findFirst({
      where: { stripe_session_id: sessionId },
      include: {
        donhang: {
          include: {
            chitietdonhang: {
              include: {
                sanpham: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: payment.donhang,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}