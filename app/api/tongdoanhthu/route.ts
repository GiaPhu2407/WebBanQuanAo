import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tongdoanhthu = await prisma.thanhtoan.count();
    return NextResponse.json(tongdoanhthu);
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
