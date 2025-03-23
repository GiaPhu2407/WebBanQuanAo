import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      where: {
        idRole: 3, // Chỉ lấy người dùng có idRole = 3 (nhân viên)
      },
      select: {
        idUsers: true,
        Tentaikhoan: true,
        Hoten: true,
        Email: true,
        idRole: true,
      },
      orderBy: {
        Hoten: "asc",
      },
    });

    return NextResponse.json({
      data: users,
      message: "Lấy danh sách nhân viên thành công",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách nhân viên" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const users = await prisma.users.deleteMany();
    return NextResponse.json({
      users,
      message: "Xoá tất cả users thành công",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
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
