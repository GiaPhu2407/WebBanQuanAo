import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Authentication check using JWT token
    const token = await getToken({ req: request });
    if (!token?.email) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Input validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate new password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { Email: token.email }
    });

    if (!user || !user.Matkhau) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.Matkhau // Now TypeScript knows Matkhau is definitely not null
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.users.update({
      where: { Email: token.email },
      data: { Matkhau: hashedPassword }
    });

    return NextResponse.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "An error occurred while changing password" },
      { status: 500 }
    );
  }
}