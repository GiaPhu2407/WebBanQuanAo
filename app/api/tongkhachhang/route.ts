import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tongkhachhang = await prisma.users.count();
    return NextResponse.json(tongkhachhang);
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
