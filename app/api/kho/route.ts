import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const KhoSchema = z.object({
    idsanpham: z.number().optional(),
    soluong: z.number().optional(),
  });

  const validation = KhoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const kho = await prisma.kho.create({
    data: {
      idsanpham: body.idsanpham,
      soluong: body.soluong,
    },
  });

  return NextResponse.json(
    { message: "Thêm mới kho thành công", kho },
    { status: 201 }
  );
}

export async function GET(request: NextRequest, response: NextResponse) {
  const kho = await prisma.kho.findMany();
  return NextResponse.json({ kho, message: "Hiện tất cả" }, { status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const kho = await prisma.kho.deleteMany();
  return NextResponse.json({ kho, message: "Xoá tất cả" }, { status: 200 });
}
