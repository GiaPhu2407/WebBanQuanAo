import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function POST(request: NextRequest) {
  const body = await request.json();

  const KeSchema = z.object({
    idvung: z.number().optional(),
    tenke: z.string().max(45).optional(),
  });

  const validation = KeSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const ke = await prisma.ke.create({
    data: {
      idvung: body.idvung,
      tenke: body.tenke,
    },
  });

  return NextResponse.json(
    { message: "Thêm mới kệ thành công", ke },
    { status: 201 }
  );
}
export async function GET(request: NextRequest, response: NextResponse) {
  const ke = await prisma.ke.findMany();
  return NextResponse.json({ ke, message: "Hiện tất cả" }, { status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const ke = await prisma.ke.deleteMany();
  return NextResponse.json({ ke, message: "Xoá tất cả" }, { status: 200 });
}
