import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { login } from "@/lib/auth";
import { loginSchema } from "../../zodschema/zodlogin/route";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const parsedBody = loginSchema.parse(body); // Validate data here

    const { identifier, password } = parsedBody; // Use "identifier" to match frontend

    const user = await login(identifier, password);

    // Return user data with role
    return NextResponse.json({
      user: {
        id: user.idUsers,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
