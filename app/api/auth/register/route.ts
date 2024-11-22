import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, fullname, phone, address } = body;

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET is not defined" },
        { status: 500 }
      );
    }

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { Email: email },
          { Tentaikhoan: username }, // Đảm bảo trường phù hợp với schema của bạn
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email hoặc username đã tồn tại" },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo token JWT
    const accessToken = jwt.sign({ username: username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    const newUser = await prisma.users.create({
      data: {
        Email: email,
        Tentaikhoan: username,
        Matkhau: hashedPassword, // Đảm bảo trường khớp với schema
        Hoten: fullname,
        Sdt: phone,
        Diachi: address || null,
        Token: accessToken,
        idRole: 1, // Gán vai trò mặc định
      },
    });

    // Trả về phản hồi thành công
    return NextResponse.json(
      {
        user: {
          id: newUser.idUsers,
          email: newUser.Email,
          username: newUser.Tentaikhoan,
          fullname: newUser.Hoten,
          phone: newUser.Sdt,
          address: newUser.Diachi,
        },
        accessToken: accessToken,
        message: "Đăng ký thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đăng ký thất bại" },
      { status: 400 }
    );
  }
}
