import prisma from "@/prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET;

const UpdateProfileSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  avatar: z.string().optional(), // Avatar URL field is optional
});

export async function PUT(req: NextRequest) {
  try {
    // Parse và validate input data
    const body = await req.json();
    const validatedData = UpdateProfileSchema.parse(body);

    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET chưa được định nghĩa" },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token không tồn tại" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    if (!username) {
      return NextResponse.json(
        { message: "Người dùng không hợp lệ trong Token" },
        { status: 401 }
      );
    }

    const user = await prisma.users.findFirst({
      where: { Tentaikhoan: username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      Hoten: validatedData.fullname,
      Sdt: validatedData.phone,
      Diachi: validatedData.address,
    };

    // Only update avatar if provided
    if (validatedData.avatar) {
      updateData.avatar = validatedData.avatar;
    }

    // Cập nhật thông tin
    const updatedUser = await prisma.users.update({
      where: { idUsers: user.idUsers },
      data: updateData,
      include: {
        role: true,
      },
    });

    // Map database field names to the field names expected by the frontend
    const mappedUser = {
      username: updatedUser.Tentaikhoan,
      fullname: updatedUser.Hoten,
      email: updatedUser.Email,
      role: updatedUser.role?.Tennguoidung || "user",
      phone: updatedUser.Sdt,
      address: updatedUser.Diachi,
      avatar: updatedUser.avatar,
    };

    return NextResponse.json({
      message: "Cập nhật thông tin thành công",
      user: mappedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu không hợp lệ",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Lỗi server", error: error.message },
      { status: 500 }
    );
  }
}
