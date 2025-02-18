import { signUp } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, fullname, phone, address } = body;

    // Kiểm tra email và username có tồn tại hay không
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ Email: email }, { Tentaikhoan: username }],
      },
    });

    if (existingUser) {
      // Trả về lỗi nếu email hoặc username đã tồn tại
      return NextResponse.json(
        { error: "Email hoặc tên người dùng đã tồn tại" },
        { status: 400 }
      );
    }

    // Tiến hành đăng ký người dùng mới nếu không có lỗi
    const user = await signUp(
      email,
      username,
      password,
      fullname,
      phone,
      address
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Đăng ký thất bại" }, { status: 400 });
  }
}
