import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tongdonhang = await prisma.donhang.count();
    return NextResponse.json(tongdonhang);
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
