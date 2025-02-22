// import { login } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/prisma/client"; // Ensure this path matches your project structure

// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { usernameOrEmail, password } = body;

//     if (!JWT_SECRET) {
//       return NextResponse.json(
//         { error: "JWT_SECRET is not defined" },
//         { status: 500 }
//       );
//     }

//     // Tìm user dựa trên email hoặc username
//     const user = await prisma.users.findFirst({
//       where: {
//         OR: [
//           { Email: usernameOrEmail }, // So sánh email
//           { Tentaikhoan: usernameOrEmail }, // So sánh username
//         ],
//       },
//     });

//     // Kiểm tra xem user có tồn tại hay không
//     if (!user) {
//       return NextResponse.json(
//         { error: "Người dùng không tồn tại" },
//         { status: 404 }
//       );
//     }

//     // Kiểm tra mật khẩu
//     // Kiểm tra mật khẩu
//     if (!user.Matkhau) {
//       return NextResponse.json(
//         { error: "Người dùng không có mật khẩu" },
//         { status: 400 }
//       );
//     }

//     const isPasswordValid = bcrypt.compareSync(password, user.Matkhau);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Mật khẩu không đúng" },
//         { status: 401 }
//       );
//     }

//     // Tạo token JWT
//     const accessToken = jwt.sign(
//       { id: user.idUsers, username: user.Tentaikhoan, email: user.Email },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Trả về thông tin người dùng và token
//     return NextResponse.json(
//       {
//         user: {
//           id: user.idUsers,
//           email: user.Email,
//           username: user.Tentaikhoan,
//           fullname: user.Hoten,
//         },
//         accessToken: accessToken, // Token cho các request sau
//         message: "Đăng nhập thành công",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Authentication failed";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

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

import { login } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // Changed from usernameOrEmail to identifier to match frontend

    const user = await login(identifier, password);

    // Make sure to return the user object with the role
    return NextResponse.json({
      user: {
        id: user.idUsers,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
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
