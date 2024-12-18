import prisma from "@/prisma/client";
import { compare, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schema to validate input data
const UserSchema = z.object({
  Tentaikhoan: z.string().max(225).optional(),
  Matkhau: z.string().max(225).optional(),
  Hoten: z.string().max(225).optional(),
  Sdt: z.string().max(15).optional(),
  Diachi: z.string().max(45).optional(),
  Email: z.string().email().max(45).optional(),
  // idRole: z.number().optional(),
  Ngaydangky: z.string().datetime().optional(),
});

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idUsers = parseInt(params.id);

  try {
    const user = await prisma.users.findUnique({
      where: {
        idUsers: idUsers,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET request error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

  
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const data = await request.json();

    // Chuẩn bị dữ liệu cập nhật
    const updateData: any = {
      Tentaikhoan: data.Tentaikhoan,
      Email: data.Email,
      Hoten: data.Hoten,
      Sdt: data.Sdt,
      Diachi: data.Diachi,
    };

    // Thêm idRole nếu có
    if (data.idRole && typeof data.idRole === "number") {
      updateData.idRole = data.idRole;
    }

    // Thực hiện cập nhật
    const updatedUser = await prisma.users.update({
      where: { idUsers: id },
      data: updateData,
      include: {
        role: { select: { Tennguoidung: true } },
      },
    });

    return NextResponse.json({
      updatedUser,
      message: "Cập nhật thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật user:", error);
    return NextResponse.json(
      { error: "Cập nhật thất bại" },
      { status: 500 }
    );
  }
}
// DELETE user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received DELETE request with params:", params);

    const idUsers = parseInt(params.id);
    console.log("Parsed idUsers:", idUsers);

    if (isNaN(idUsers)) {
      console.error("Invalid id format:", params.id);
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { idUsers: idUsers },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.users.delete({
      where: { idUsers: idUsers },
    });

    return NextResponse.json(
      { message: `Xóa người dùng ID ${params.id} thành công` },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE request error:", error);
    return NextResponse.json({ error: "Lỗi xóa người dùng" }, { status: 500 });
  }
}
