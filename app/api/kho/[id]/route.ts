import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function PUT(request: NextRequest) {
  const body = await request.json();

  const KhoSchema = z.object({
    idsanpham: z.number(),
    soluong: z.number().optional(),
  });

  const validation = KhoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const existingKho = await prisma.kho.findUnique({
    where: { idsanpham: body.idsanpham },
  });

  if (!existingKho) {
    return NextResponse.json({ message: "Kho không tồn tại" }, { status: 404 });
  }

  const updatedKho = await prisma.kho.update({
    where: { idsanpham: body.idsanpham },
    data: {
      soluong: body.soluong,
    },
  });

  return NextResponse.json(
    { message: "Cập nhật kho thành công", updatedKho },
    { status: 200 }
  );
}
