import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const processingAmount = await prisma.thanhtoan.aggregate({
      _sum: {
        sotien: true,
      },
    //   where: {
    //     trangthai: "Đang xử lý",
    //   },
    });

    // Use optional chaining and provide a default value of 0
    const totalAmount = processingAmount._sum.sotien ?? 0;

    return NextResponse.json({
      amount: totalAmount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
