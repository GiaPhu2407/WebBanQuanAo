import { signUp } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const { email, username, password, fullname, phone, address, avatar } =
      body;

    // Kiểm tra các trường bắt buộc - removing address from required fields
    if (!email || !username || !password || !fullname || !phone) {
      return NextResponse.json(
        { error: "Thiếu thông tin yêu cầu" },
        { status: 400 }
      );
    }

    // Kiểm tra email và username có tồn tại không
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ Email: email }, { Tentaikhoan: username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email hoặc tên người dùng đã tồn tại" },
        { status: 400 }
      );
    }

    // Log avatar để kiểm tra URL
    console.log("Avatar URL:", avatar);

    // Tiến hành đăng ký người dùng
    const user = await signUp(
      email,
      username,
      password,
      fullname,
      phone,
      address || "",
      avatar || null
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Đăng ký thất bại" }, { status: 500 });
  }
}
