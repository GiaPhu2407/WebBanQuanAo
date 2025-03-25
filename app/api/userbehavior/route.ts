// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/prisma/client";
// import { UserAction } from "@prisma/client"; // Đảm bảo rằng bạn đã import UserAction từ Prisma model

// export async function POST(req: NextRequest) {
//   const { idsanpham, idUsers, action } = await req.json();

//   // Kiểm tra sự tồn tại của người dùng
//   const user = await prisma.users.findUnique({
//     where: {
//       idUsers: idUsers,
//     },
//   });
//   if (!user) {
//     return NextResponse.json(
//       { message: "Người dùng không tồn tại" },
//       { status: 404 }
//     );
//   }

//   // Tính điểm dựa trên hành động (view < add_to_cart < purchase)
//   let points = 0;
//   switch (action) {
//     case UserAction.view:
//       points = 1; // Sản phẩm được xem
//       break;
//     case UserAction.add_to_cart:
//       points = 2; // Sản phẩm được thêm vào giỏ
//       break;
//     case UserAction.purchase:
//       points = 3; // Sản phẩm được mua
//       break;
//     default:
//       points = 0;
//   }

//   // Lưu hành vi của người dùng và tính điểm cho sản phẩm
//   await prisma.userBehavior.create({
//     data: {
//       idsanpham,
//       idUsers,
//       action,
//       score: points,
//     },
//   });

//   return NextResponse.json(
//     { message: "Theo dõi hành vi thành công và tính điểm sản phẩm" },
//     { status: 200 }
//   );
// }
// // Hàm này sẽ được gọi khi người dùng xem một sản phẩm
// export const trackProductView = async (productId: number, userId: number) => {
//   try {
//     const response = await fetch("/api/userBehavior", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: userId,
//         productId: productId,
//         action: "view", // Lưu hành động "view"
//       }),
//     });

//     if (response.ok) {
//       console.log("Hành vi xem sản phẩm đã được theo dõi");
//     } else {
//       console.error("Không thể theo dõi hành vi", await response.json());
//     }
//   } catch (error) {
//     console.error("Lỗi khi gọi API theo dõi hành vi:", error);
//   }
// };
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Enum for user actions
enum UserAction {
  VIEW = "view",
  ADD_TO_CART = "add_to_cart",
  PURCHASE = "purchase",
}

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, action } = await req.json();

    // Validate user
    const user = await prisma.users.findUnique({
      where: { idUsers: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Calculate points based on action
    let points = 0;
    switch (action) {
      case UserAction.VIEW:
        points = 1;
        break;
      case UserAction.ADD_TO_CART:
        points = 2;
        break;
      case UserAction.PURCHASE:
        points = 3;
        break;
      default:
        points = 0;
    }

    // Create user behavior record
    await prisma.userBehavior.create({
      data: {
        idsanpham: productId,
        idUsers: userId,
        action,
        score: points,
      },
    });

    // Update product view count (optional)
    await prisma.sanpham.update({
      where: { idsanpham: productId },
      data: {
        totalViews: {
          increment: action === UserAction.VIEW ? 1 : 0,
        },
      },
    });

    return NextResponse.json(
      { message: "User behavior tracked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tracking user behavior:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
