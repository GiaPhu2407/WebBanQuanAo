import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest, response: NextResponse) {
  const user = await prisma.users.findMany();
  return NextResponse.json({ user, message: "Tất cả các id", status: 200 });
}
export async function DELETE(request: NextRequest, response: NextResponse) {
  const user = await prisma.users.deleteMany();
  return NextResponse.json({ user, message: "Xoá cả các id", status: 200 });
}
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/prisma/client";

// export async function GET(request: NextRequest) {
//   try {
//     // Lấy token từ header
//     const authHeader = request.headers.get("Authorization");
//     const token = authHeader?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json(
//         { error: "Token không được gửi." },
//         { status: 401 }
//       );
//     }

//     // Kiểm tra giá trị JWT_SECRET trong .env
//     const secretKey = process.env.JWT_SECRET || "your_secret_key";

//     try {
//       // Giải mã token
//       const decoded = jwt.verify(token, secretKey) as { idUsers: number };

//       if (!decoded || !decoded.idUsers) {
//         return NextResponse.json(
//           { error: "Token không hợp lệ." },
//           { status: 401 }
//         );
//       }

//       // Truy xuất thông tin người dùng từ database
//       const user = await prisma.users.findUnique({
//         where: { idUsers: decoded.idUsers },
//         select: {
//           idUsers: true,
//           Tentaikhoan: true,
//           Hoten: true,
//           Sdt: true,
//           Diachi: true,
//           Email: true,
//           Ngaydangky: true,
//           idRole: true,
//         },
//       });

//       if (!user) {
//         return NextResponse.json(
//           { error: "Người dùng không tồn tại." },
//           { status: 404 }
//         );
//       }

//       // Trả về thông tin người dùng
//       return NextResponse.json({ user });
//     } catch (err) {
//       console.error("JWT Verify Error:", err);
//       return NextResponse.json(
//         { error: "Token không hợp lệ hoặc đã hết hạn." },
//         { status: 401 }
//       );
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: "Lỗi hệ thống." }, { status: 500 });
//   }
// }
