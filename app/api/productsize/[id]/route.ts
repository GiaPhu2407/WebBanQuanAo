import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sizeId = Number(params.id);

  try {
    const getProductSize = await prisma.productSize.findMany({
      where: {
        idSize: sizeId,
      },
    });
    return NextResponse.json(
      { getProductSize, message: "Get data Success" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sizeId = Number(params.id);
  const data = await req.json();
  try {
    const updateProductSize = await prisma.productSize.updateMany({
      where: {
        idSize: sizeId,
      },
      data: {
        idsanpham: data.product_id,
        idSize: data.size_id,
        soluong: data.stock_quantity,
      },
    });
    return NextResponse.json(
      { updateProductSize, message: " Success" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sizeId = Number(params.id);
  const deleteProductSize = await prisma.productSize.deleteMany({
    where: {
      idSize: sizeId,
    },
  });
  return NextResponse.json(
    { deleteProductSize, message: "deleted Success" },
    { status: 200 }
  );
}
