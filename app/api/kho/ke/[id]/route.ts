import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

// Schema validation cho dữ liệu của kệ
const KeSchema = z.object({
  tenke: z.string().max(45).optional(),
  idvung: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const idKe = parseInt(params.id);

  // Validate dữ liệu đầu vào
  const validation = KeSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }

  // Kiểm tra kệ có tồn tại không
  const existingKe = await prisma.ke.findUnique({
    where: { idke: idKe },
  });

  if (!existingKe) {
    return NextResponse.json({ error: "Kệ không tồn tại" }, { status: 404 });
  }

  try {
    // Cập nhật thông tin kệ
    const updatedKe = await prisma.ke.update({
      where: { idke: idKe },
      data: {
        tenke: body.tenke || existingKe.tenke,
        idvung: body.idvung || existingKe.idvung,
      },
    });

    return NextResponse.json(
      { message: `Cập nhật kệ ${idKe} thành công`, ke: updatedKe },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật kệ:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật kệ" },
      { status: 500 }
    );
  }
}
