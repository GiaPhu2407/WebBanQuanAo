import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";

// Get all addresses for admin purposes without authentication
// This is specifically for the order management system
export async function GET(request: NextRequest) {
  try {
    // Get all addresses
    const addresses = await prisma.diaChi.findMany();

    // Transform into a map for easier lookup
    const addressMap = addresses.reduce((acc, address) => {
      acc[address.idDiaChi] = address;
      return acc;
    }, {} as Record<number, any>);

    return NextResponse.json({
      success: true,
      addresses: addressMap,
    });
  } catch (error: any) {
    console.error("Error fetching all addresses:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}
