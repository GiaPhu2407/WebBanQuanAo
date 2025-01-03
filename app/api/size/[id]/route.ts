import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sizeId = Number(params.id);
  const getSizeId = await prisma.size.findUnique({
    where: {
    idSize: sizeId,
    },
  });
  return NextResponse.json({ getSizeId, message: "success" }, { status: 201 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sizeId = Number(params.id);
  const data = await req.json();
  try {
    const updateSize = await prisma.size.update({
      where: {
        idSize: sizeId,
      },
      data: {
        tenSize: data.name_size,
      },
    });
    return NextResponse.json(
      { updateSize, message: "updated success" },
      { status: 201 }
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
  const deletedSize = await prisma.size.delete({
    where: {
      idSize: sizeId,
    },
  });
  return NextResponse.json(
    { deletedSize, message: "delete success" },
    { status: 201 }
  );
}
