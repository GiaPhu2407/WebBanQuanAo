import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const user = await prisma.role.findMany();
  return NextResponse.json({ user, message: "Tất cả các id", status: 200 });
}
