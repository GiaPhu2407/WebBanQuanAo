import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const donhang = await prisma.donhang.count({
      where: {
        trangthai: "Chờ thanh toán",
      },
    });
    return NextResponse.json(donhang);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
