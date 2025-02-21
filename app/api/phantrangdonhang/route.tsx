// import prisma from "@/prisma/client";
// import { NextRequest, NextResponse } from "next/server";
// import { getSession } from '@/lib/auth';

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
//     const limit_size = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
//     const userId = searchParams.get('userId') ? Number(searchParams.get('userId')) : undefined;

//     // Get session to check user role
//     const session = await getSession();
//     const skip = (page - 1) * limit_size;

//     // Base query conditions
//     let whereCondition: any = {};

//     // If user is not admin and userId is provided, filter by userId
//     if (session?.role?.TenNguoiDung !== 'Admin' && userId) {
//       whereCondition.idUsers = userId;
//     }

//     // Get total count with filters applied
//     const totalRecords = await prisma.donhang.count({
//       where: whereCondition
//     });

//     const totalPage = Math.ceil(totalRecords / limit_size);

//     // Get paginated data with filters and include customer details
//     const data = await prisma.donhang.findMany({
//       where: whereCondition,
//       skip: skip,
//       take: limit_size,
//       include: {
//         users: {
//           select: {
//             Hoten: true,
//             Email: true,
//             Sdt: true,
//           }
//         },
//         lichgiaohang: {
//           select: {
//             NgayGiao: true
//           }
//         }
//       },
//       orderBy: {
//         iddonhang: 'desc' // Most recent orders first
//       }
//     });

//     return NextResponse.json({
//       data,
//       meta: {
//         page,
//         limit_size,
//         totalRecords,
//         totalPage,
//       }
//     }, { status: 200 });

//   } catch (error: any) {
//     console.error('Error in pagination API:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit_size = parseInt(searchParams.get("limit_size") || "10");
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit_size;

    const whereClause = userId ? { idUsers: parseInt(userId) } : {};

    const [donhangs, total] = await Promise.all([
      prisma.donhang.findMany({
        where: whereClause,
        skip,
        take: limit_size,
        include: {
          chitietdonhang: {
            include: {
              sanpham: {
                select: {
                  idsanpham: true,
                  tensanpham: true,
                  gia: true,
                  hinhanh: true,
                  gioitinh: true,
                },
              },
              size: true,
            },
          },
          users: {
            select: {
              Hoten: true,
              Email: true,
              Sdt: true,
            },
          },
          lichgiaohang: {
            select: {
              NgayGiao: true,
              TrangThai: true,
            },
          },
        },
        orderBy: {
          iddonhang: "desc",
        },
      }),
      prisma.donhang.count({
        where: whereClause,
      }),
    ]);

    const totalPage = Math.ceil(total / limit_size);

    return NextResponse.json({
      data: donhangs,
      meta: {
        page,
        limit_size,
        totalRecords: total,
        totalPage,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
