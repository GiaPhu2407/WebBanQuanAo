// import { getSession } from "@/lib/auth";
// import prisma from "@/prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// // API lấy danh sách sản phẩm trong giỏ hàng
// export async function GET() {
//   try {
//     const session = await getSession();

//     // Kiểm tra session người dùng
//     // if (!session || !session.idUsers) {
//     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     // }

//     // Lấy dữ liệu giỏ hàng
//     const cartItem = await prisma.giohang.findMany({
//       where: {
//         idkhachhang: session.idUsers,
//       },
//       include: {
//         sanpham: {
//           select: {
//             tensanpham: true,
//             mota: true,
//             gia: true,
//             hinhanh: true,
//             giamgia: true,
//             gioitinh: true, // Boolean
//             size: true,
//           },
//         },
//       },
//     });

//     // Chuyển đổi giới tính từ Boolean sang chuỗi
//     // const cartItemsWithGender = cartItem.map((item) => ({
//     //   ...item,
//     //   sanpham: {
//     //     ...item.sanpham,
//     //     gioitinh: item.sanpham?.gioitinh ? "Nam" : "Nữ",
//     //   },
//     // }));

//     return NextResponse.json(cartItem);
//   } catch (error) {
//     console.error("Cart fetch error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// // API thêm sản phẩm vào giỏ hàng
// export async function POST(req: NextRequest) {
//   try {
//     const session = await getSession();

//     // Kiểm tra session người dùng
//     if (!session || !session.idUsers) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Lấy dữ liệu từ request body
//     const { idsanpham, soluong } = await req.json();

//     // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
//     const existingItem = await prisma.giohang.findFirst({
//       where: {
//         idsanpham,
//         idkhachhang: session.idUsers,
//       },
//     });

//     if (existingItem) {
//       // Nếu đã tồn tại, cập nhật số lượng
//       const updatedItem = await prisma.giohang.update({
//         where: {
//           idgiohang: existingItem.idgiohang,
//         },
//         data: {
//           soluong: existingItem.soluong + soluong,
//         },
//       });
//       return NextResponse.json(updatedItem);
//     }

//     // Nếu chưa tồn tại, thêm mới sản phẩm
//     const cartItem = await prisma.giohang.create({
//       data: {
//         idsanpham,
//         soluong,
//         idkhachhang: session.idUsers,
//       },
//     });

//     return NextResponse.json(cartItem);
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// API lấy danh sách sản phẩm trong giỏ hàng
export async function GET(request: NextRequest) {
  try {
    // Log toàn bộ request để debug
    console.log("Full Request Headers:", request.headers);

    const session = await getSession();
    
    // Log thông tin session để debug
    console.log("Session:", session);

    // Nếu không có session, trả về lỗi chi tiết
    if (!session) {
      return NextResponse.json(
        { 
          error: "Phiên đăng nhập không hợp lệ", 
          details: "Không tìm thấy thông tin người dùng" 
        }, 
        { status: 401 }
      );
    }

    // Kiểm tra idUsers một cách an toàn
    const userId = session.idUsers;
    if (!userId) {
      return NextResponse.json(
        { 
          error: "Không có thông tin người dùng", 
          details: "ID người dùng không tồn tại" 
        }, 
        { status: 401 }
      );
    }

    // Lấy dữ liệu giỏ hàng với thông tin sản phẩm chi tiết
    const cartItems = await prisma.giohang.findMany({
      where: {
        idKhachHang: userId,
      },
      include: {
        sanpham: {
          select: {
            tensanpham: true,
            mota: true,
            gia: true,
            hinhanh: true,
            giamgia: true,
            gioitinh: true,
            size: true,
          },
        },
      }
    });

    // Chuyển đổi giới tính từ Boolean sang chuỗi (nếu cần)
    // const formattedCartItems = cartItems.map((item) => ({
    //   ...item,
    //   sanpham: {
    //     ...item.sanpham,
    //     gioitinh: item.sanpham?.gioitinh ? "Nam" : "Nữ",
    //   },
    // }));

    return NextResponse.json({
      message: "Lấy giỏ hàng thành công",
      data: cartItems,
      total: cartItems.length
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { 
        error: "Không thể tải giỏ hàng", 
        details: error instanceof Error ? error.message : "Lỗi không xác định" 
      }, 
      { status: 500 }
    );
  }
}
// API thêm sản phẩm vào giỏ hàng
  export async function POST(req: NextRequest) {
    try {
      const session = await getSession();

      // Kiểm tra session người dùng
      if (!session || !session.idUsers) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Lấy dữ liệu từ request body
      const { idsanpham, soluong } = await req.json();

      // Kiểm tra sản phẩm có tồn tại không
      const existingProduct = await prisma.sanpham.findUnique({
        where: { idsanpham }
      });

      if (!existingProduct) {
        return NextResponse.json(
          { error: "Sản phẩm không tồn tại" }, 
          { status: 404 }
        );
      }

      // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
      const existingItem = await prisma.giohang.findFirst({
        where: {
          idsanpham,
          idKhachHang: session.idUsers,
        },
      });

      if (existingItem) {
        // Nếu đã tồn tại, cập nhật số lượng
        const updatedItem = await prisma.giohang.update({
          where: {
            idgiohang: existingItem.idgiohang,
          },
          data: {
            soluong: existingItem.soluong + soluong,
          },
          include: {
            sanpham: true
          }
        });
        
        return NextResponse.json({
          message: "Cập nhật số lượng sản phẩm trong giỏ hàng",
          data: updatedItem
        });
      }

      // Nếu chưa tồn tại, thêm mới sản phẩm
      const cartItem = await prisma.giohang.create({
        data: {
          idsanpham,
          soluong,
          idKhachHang: session.idUsers,
        },
        include: {
          sanpham: true
        }
      });

      return NextResponse.json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cartItem
      }, { status: 201 });

    } catch (error) {
      console.error("Add to cart error:", error);
      return NextResponse.json(
        { 
          error: "Không thể thêm sản phẩm vào giỏ hàng", 
          details: error instanceof Error ? error.message : "Lỗi không xác định" 
        }, 
        { status: 500 }
      );
    }
  }