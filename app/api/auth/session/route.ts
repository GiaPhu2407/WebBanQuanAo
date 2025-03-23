import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: {
        idUsers: session.idUsers,
      },
      select: {
        idUsers: true,
        Email: true,
        Tentaikhoan: true,
        Hoten: true,
        Sdt: true,
        Diachi: true,
        avatar: true,
        idRole: true,
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Trả về đúng tên trường như trong database
    return NextResponse.json({
      idUsers: user.idUsers,
      Email: user.Email, // Giữ nguyên tên trường
      Tentaikhoan: user.Tentaikhoan,
      Hoten: user.Hoten,
      Sdt: user.Sdt,
      Diachi: user.Diachi,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
