import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const thanhtoanDangXuLy = await prisma.thanhtoan.count({
      where: {
        trangthai: "Pending confirmation",
      },
    });
    return NextResponse.json({ count: thanhtoanDangXuLy });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
