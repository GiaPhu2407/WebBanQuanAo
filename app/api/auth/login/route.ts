import { login } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client"; // Ensure this path matches your project structure

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usernameOrEmail, password } = body;

    const user = await login(usernameOrEmail, password);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const users = await prisma.users.findMany({
//       select: {
//         idUsers: true,
//         Email: true,
//         Tentaikhoan: true,
//         // Add other fields you want to return, but exclude sensitive data like passwords
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch users",
//       },
//       { status: 500 }
//     );
//   }
// }
