// import prisma from "@/prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const page = Number(searchParams.get("page")) || 1;
//     const limit_size = Number(searchParams.get("limit_size")) || 10;
//     const skip = (page - 1) * limit_size;

//     // Lấy tổng số bản ghi
//     const totalRecords = await prisma.sanpham.count();

//     // Lấy danh sách sản phẩm
//     const sanpham = await prisma.sanpham.findMany({
//       skip,
//       take: limit_size,
//       orderBy: {
//         idsanpham: "desc",
//       },
//       include: {
//         loaisanpham: true,
//       },
//     });

//     // Format response để match với interface
//     const formattedData = sanpham.map((item) => ({
//       idsanpham: item.idsanpham,
//       tensanpham: item.tensanpham,
//       hinhanh: item.hinhanh,
//       gia: Number(item.gia).toFixed(0), // Chuyển Decimal sang Number rồi format thành string
//       mota: item.mota,
//       idloaisanpham: item.idloaisanpham,
//       giamgia: item.giamgia,
//       gioitinh: item.gioitinh,
//       size: item.size,
//       LoaiSanPham: item.loaisanpham
//         ? {
//             tenloai: item.loaisanpham.tenloai,
//             mota: item.loaisanpham.mota,
//           }
//         : undefined,
//     }));

//     const totalPages = Math.ceil(totalRecords / limit_size);
//     return NextResponse.json({
//       data: formattedData,
//       meta: {
//         page,
//         limit_size,
//         totalRecords,
//         totalPages, // Đảm bảo khớp với interface Meta trong component
//       },
//     });
//   } catch (error) {
//     console.error("Error in GET /api/sanpham:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page: number = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit_size: number = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
    const skip = (page - 1) * limit_size;
    
    // Search parameter
    const searchText = searchParams.get('search') || '';

    // Construct where clause for search across multiple fields
    const whereClause = searchText ? {
      OR: [
        { tensanpham: { contains: searchText } },
        { mota: { contains: searchText } },
        { trangthai: { contains: searchText } },
        { size: { contains: searchText } },
        { loaisanpham: { tenloai: { contains: searchText } } }
      ]
    } : {};

    // Count total records with search filter
    const totalRecords = await prisma.sanpham.count({
      where: whereClause
    });

    const totalPage = Math.ceil(totalRecords / limit_size);

    // Fetch data with search, pagination, and related data
    const data = await prisma.sanpham.findMany({
      where: whereClause,
      skip: skip,
      take: limit_size,
      include: {
        loaisanpham: true,
        images: true,
        ProductSizes: true,
        kho: true
      },
      orderBy: {
        idsanpham: 'asc'
      }
    });

    return NextResponse.json(
      {
        data,
        meta: {
          totalRecords,
          totalPage,
          page,
          limit_size,
          skip,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : error 
      },
      { status: 500 }
    );
  }
}