import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const demdonhang = await prisma.giohang.count();
    return NextResponse.json(demdonhang);
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
