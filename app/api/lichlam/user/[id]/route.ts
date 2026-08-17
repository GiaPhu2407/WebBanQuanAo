import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "ID người dùng không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    // Fetch all work schedules for the specific user
    const lichLamViec = await prisma.lichLamViec.findMany({
      where: {
        idUsers: userId,
      },
      include: {
        user: true,
        caLamViec: true,
      },
      orderBy: {
        NgayLamViec: "asc",
      },
    });

    return NextResponse.json(
      { data: lichLamViec, message: "Lấy lịch làm việc thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi lấy lịch làm việc:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
