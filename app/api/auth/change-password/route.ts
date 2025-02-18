import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import prisma from "@/prisma/client";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ChangePasswordSchema.parse(body);
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.users.findFirst({
      where: { Token: token },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await verifyPassword(
      validatedData.currentPassword,
      user.Matkhau ?? ""
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    await prisma.users.update({
      where: { idUsers: user.idUsers },
      data: { Matkhau: hashedNewPassword },
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while changing password" },
      { status: 500 }
    );
  }
}
