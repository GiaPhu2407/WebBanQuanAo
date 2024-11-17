import prisma from "@/prisma/client";
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
  idRole: z.number().optional(),
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

// PUT (Update) user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received PUT request with params:", params);

    const body = await request.json();
    console.log("Request body:", body);

    const idUsers = parseInt(params.id);
    console.log("Parsed idUsers:", idUsers);

    if (isNaN(idUsers)) {
      console.error("Invalid id format:", params.id);
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra xem user có tồn tại không
    const existingUserById = await prisma.users.findUnique({
      where: { idUsers: idUsers },
    });

    if (!existingUserById) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Validate input data
    const validation = UserSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if email exists (if email is being updated)
    if (body.Email && body.Email !== existingUserById.Email) {
      const existingUser = await prisma.users.findUnique({
        where: { Email: body.Email },
      });
      console.log("Existing user with email:", existingUser);

      if (existingUser && existingUser.idUsers !== idUsers) {
        return NextResponse.json(
          { error: "Email đã tồn tại" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { idUsers: idUsers },
      data: validation.data,
    });

    console.log("Updated user:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật người dùng" },
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
