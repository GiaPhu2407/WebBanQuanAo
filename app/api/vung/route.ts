import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const VungSchema = z.object({
    idkho: z.number().optional(),
    tenvung: z.string().max(45).optional(),
  });

  const validation = VungSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const vung = await prisma.vung.create({
    data: {
      idkho: body.idkho,
      tenvung: body.tenvung,
    },
  });

  return NextResponse.json(
    { message: "Thêm mới vùng thành công", vung },
    { status: 201 }
  );
}
export async function GET(request: NextRequest, response: NextResponse) {
  const vung = await prisma.vung.findMany();
  return NextResponse.json({ vung, message: "Hiện tất cả" }, { status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const vung = await prisma.vung.deleteMany();
  return NextResponse.json({ vung, message: "Xoá tất cả" }, { status: 200 });
}
