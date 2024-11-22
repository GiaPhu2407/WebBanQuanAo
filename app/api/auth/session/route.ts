import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(null);
    }

    // Fetch full user data from database
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
        idRole: true,
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    // Return user data without sensitive information
    return NextResponse.json({
      idUsers: user.idUsers,
      email: user.Email,
      username: user.Tentaikhoan,
      fullName: user.Hoten,
      phone: user.Sdt,
      address: user.Diachi,
      role: user.role,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(null);
  }
}
