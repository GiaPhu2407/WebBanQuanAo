import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const user = await prisma.users.findMany();
  return NextResponse.json({ user, message: "Tất cả các id", status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const user = await prisma.users.deleteMany();
  return NextResponse.json({ user, message: "Xoá cả các id", status: 200 });
}
