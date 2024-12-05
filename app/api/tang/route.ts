import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const TangSchema = z.object({
    idke: z.number(),
    tentang: z.string().max(45),
  });

  const validation = TangSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const tang = await prisma.tang.create({
    data: {
      idke: body.idke,
      tentang: body.tentang,
    },
  });

  return NextResponse.json(
    { message: "Thêm tầng thành công", tang },
    { status: 201 }
  );
}

export async function GET(request: NextRequest, response: NextResponse) {
  const tang = await prisma.tang.findMany();
  return NextResponse.json({ tang, message: "Hiện tất cả" }, { status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const tang = await prisma.tang.deleteMany();
  return NextResponse.json({ tang, message: "Xoá tất cả" }, { status: 200 });
}
