import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ProductSchema } from "@/app/zodschema/route";
import { Decimal } from "@prisma/client/runtime/library";



export async function POST(req: NextRequest) {
  try {
    const {
      tensanpham,
      mota,
      gia,
      idloaisanpham,
      mausac,
      giamgia,
      gioitinh,
      productSizes,
      hinhanh
    } = await req.json();

    // Validation
    if (!tensanpham || !gia || !idloaisanpham || !productSizes) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Convert productSizes object to array format for Prisma
    const formattedSizes = Object.entries(productSizes).map(([idSize, soluong]) => ({
      idSize: Number(idSize),
      soluong: Number(soluong)
    }));

    // Create new product with nested size creation
    const newProduct = await prisma.sanpham.create({
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        mausac,
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? Number(giamgia) : null,
        gioitinh,
        hinhanh,
        ProductSizes: {
          create: formattedSizes
        },
      },
      include: {
        ProductSizes: true,
        loaisanpham: true
      }
    });

    return NextResponse.json(
      {
        data: newProduct,
        message: "Thêm sản phẩm thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi thêm sản phẩm:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Delete all products
    await prisma.sanpham.deleteMany();

    return NextResponse.json({
      message: "Xoá tất cả sản phẩm thành công",
      status: 200,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Lỗi khi xoá sản phẩm: " + e.message,
      },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Đảm bảo đường dẫn tới prisma instance

export async function GET() {
  try {
    const products = await prisma.sanpham.findMany({
      include: {
        loaisanpham: true,
        ProductSizes: {
          include: {
            size: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   const sanpham = await prisma.sanpham.findMany();
//   return NextResponse.json({ sanpham, message: "success" }, { status: 201 });
// }



// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const categories = searchParams.get('idloaisanpham')?.split(',').map(Number);
//     const gender = searchParams.get('gioitinh');
//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     const sizes = searchParams.get('sizes')?.split(',');

//     let where: any = {};

//     if (categories?.length) {
//       where.idloaisanpham = { in: categories };
//     }
    
//     if (gender !== null && gender !== undefined) {
//       where.gioitinh = gender === 'true';
//     }

//     if (minPrice || maxPrice) {
//       where.gia = {};
//       if (minPrice) where.gia.gte = parseInt(minPrice);
//       if (maxPrice) where.gia.lte = parseInt(maxPrice);
//     }

//     if (sizes?.length) {
//       where.ProductSizes = {
//         some: {
//           size: {
//             tenSize: {
//               in: sizes
//             }
//           }
//         }
//       };
//     }

//     const products = await prisma.sanpham.findMany({
//       where,
//       include: {
//         loaisanpham: true,
//         ProductSizes: {
//           include: {
//             size: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ sanpham: products });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { error: "Lỗi khi lấy danh sách sản phẩm" },
//       { status: 500 }
//     );
//   }
// }
