import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation cho dữ liệu của tầng
const TangSchema = z.object({
  tentang: z.string().max(255).optional(),
  idke: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const idTang = parseInt(params.id);

  // Validate dữ liệu đầu vào
  const validation = TangSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }

  // Kiểm tra tầng có tồn tại không
  const existingTang = await prisma.tang.findUnique({
    where: { idtang: idTang },
  });

  if (!existingTang) {
    return NextResponse.json({ error: "Tầng không tồn tại" }, { status: 404 });
  }

  try {
    // Cập nhật tầng
    const updatedTang = await prisma.tang.update({
      where: { idtang: idTang },
      data: {
        tentang: body.tentang || existingTang.tentang,
        idke: body.idke || existingTang.idke,
      },
    });

    return NextResponse.json(
      { message: `Cập nhật tầng ${idTang} thành công`, tang: updatedTang },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật tầng:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật tầng" },
      { status: 500 }
    );
  }
}
