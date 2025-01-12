import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const getProductSize = await prisma.productSize.findMany();
  return NextResponse.json(
    { getProductSize, message: "Get data Success" },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    // Check if product size already exists
    const existingProductSize = await prisma.productSize.findFirst({
      where: {
        idsanpham: data.idsanpham,
        idSize: data.idSize,
      },
    });

    let result;
    if (existingProductSize) {
      // Update existing record
      result = await prisma.productSize.update({
        where: {
          idsanpham_idSize: {
            idsanpham: data.idsanpham,
            idSize: data.idSize,
          },
        },
        data: {
          soluong: data.soluong,
        },
      });
    } else {
      // Create new record
      result = await prisma.productSize.create({
        data: {
          idsanpham: data.idsanpham,
          idSize: data.idSize,
          soluong: data.soluong,
        },
      });
    }

    return NextResponse.json({ result, message: "Success" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/productsize:", error);
    return NextResponse.json(
      { error: "Failed to update product size: " + error.message },
      { status: 500 }
    );
  }
}
