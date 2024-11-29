import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

// Schema validation cho dữ liệu của vùng
const VungSchema = z.object({
  tenvung: z.string().max(45).optional(),
  idkho: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const idVung = parseInt(params.id);

  // Validate dữ liệu đầu vào
  const validation = VungSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }

  // Kiểm tra vùng có tồn tại không
  const existingVung = await prisma.vung.findUnique({
    where: { idVung: idVung },
  });

  if (!existingVung) {
    return NextResponse.json({ error: "Vùng không tồn tại" }, { status: 404 });
  }

  try {
    // Cập nhật thông tin vùng
    const updatedVung = await prisma.vung.update({
      where: { idVung: idVung },
      data: {
        tenvung: body.tenvung || existingVung.tenvung,
        idkho: body.idkho || existingVung.idkho,
      },
    });

    return NextResponse.json(
      { message: `Cập nhật vùng ${idVung} thành công`, vung: updatedVung },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật vùng:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật vùng" },
      { status: 500 }
    );
  }
}
