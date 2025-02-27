// app/api/donhang/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
      const donhang = await prisma.donhang.findMany({
        include: {
          users: true,
          thanhtoan: true,
          chitietdonhang: {
            include: {
              sanpham: true,
            }
          }
        },
        orderBy: {
          ngaydat: 'desc'
        }
      });
      return NextResponse.json(donhang);
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching orders", error },
        { status: 500 }
      );
    }
  }

// API endpoint to clear notifications
