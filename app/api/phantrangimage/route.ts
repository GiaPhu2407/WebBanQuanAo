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
    // nếu trên url không cớ search page param thì gán bằng 1
    const page: number = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit_size: number = searchParams.get("limit_size")
      ? Number(searchParams.get("limit_size"))
      : 10;

    const skip = (page - 1) * limit_size;
    // tính tổng số trang
    // 1. đếm xem có bao nhiêu bản ghi hiện tại trong cở sở dữ liệu
    const totalRecords = await prisma.image.count();

    const totalPage = Math.ceil(totalRecords / limit_size);

    const data = await prisma.image.findMany({
      skip: skip,
      take: limit_size,
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
        },
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
