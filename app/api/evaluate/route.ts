// // app/api/evaluate/route.ts
// Chỉ cho đánh giá 1 lần
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import prisma from "@/prisma/client";

// // Schema validation cho đánh giá
// const ReviewSchema = z.object({
//   idsanpham: z.number({
//     required_error: "ID sản phẩm không được để trống",
//   }),
//   idUsers: z.number({
//     required_error: "ID người dùng không được để trống",
//   }),
//   sao: z
//     .number()
//     .min(1, { message: "Số sao phải từ 1 đến 5" })
//     .max(5, { message: "Số sao phải từ 1 đến 5" }),
//   noidung: z
//     .string()
//     .min(1, { message: "Nội dung đánh giá không được để trống" })
//     .max(45, { message: "Nội dung đánh giá tối đa 45 ký tự" }),
// });

// // GET - Lấy danh sách đánh giá cho sản phẩm
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const idsanpham = searchParams.get("idsanpham");

//     if (!idsanpham) {
//       return NextResponse.json(
//         { message: "ID sản phẩm không được để trống" },
//         { status: 400 }
//       );
//     }

//     const reviews = await prisma.danhgia.findMany({
//       where: {
//         idsanpham: parseInt(idsanpham),
//       },
//       include: {
//         users: {
//           select: {
//             Tentaikhoan: true,
//             Hoten: true,
//             // Avatar: true,
//           },
//         },
//       },
//       orderBy: {
//         ngaydanhgia: "desc",
//       },
//     });

//     return NextResponse.json({ data: reviews }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return NextResponse.json(
//       { message: "Lỗi khi tải đánh giá" },
//       { status: 500 }
//     );
//   }
// }

// // POST - Tạo đánh giá mới
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     console.log("Received review data:", body);

//     // Validate dữ liệu đầu vào
//     const validationResult = ReviewSchema.safeParse(body);
//     if (!validationResult.success) {
//       return NextResponse.json(
//         { errors: validationResult.error.errors },
//         { status: 400 }
//       );
//     }

//     // Kiểm tra sản phẩm và người dùng tồn tại
//     const [product, user] = await Promise.all([
//       prisma.sanpham.findUnique({
//         where: { idsanpham: body.idsanpham },
//       }),
//       prisma.users.findUnique({
//         where: { idUsers: body.idUsers },
//       }),
//     ]);

//     if (!product || !user) {
//       return NextResponse.json(
//         { message: "Sản phẩm hoặc người dùng không tồn tại" },
//         { status: 404 }
//       );
//     }

//     // Kiểm tra người dùng đã đánh giá chưa
//     const existingReview = await prisma.danhgia.findFirst({
//       where: {
//         idsanpham: body.idsanpham,
//         idUsers: body.idUsers,
//       },
//     });

//     if (existingReview) {
//       return NextResponse.json(
//         { message: "Bạn đã đánh giá sản phẩm này rồi" },
//         { status: 400 }
//       );
//     }

//     // Tạo đánh giá mới
//     const newReview = await prisma.danhgia.create({
//       data: {
//         idsanpham: body.idsanpham,
//         idUsers: body.idUsers,
//         sao: body.sao,
//         noidung: body.noidung,
//         ngaydanhgia: new Date(),
//       },
//       include: {
//         users: {
//           select: {
//             Tentaikhoan: true,
//             Hoten: true,
//             // Avatar: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       { data: newReview, message: "Thêm đánh giá thành công" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating review:", error);
//     return NextResponse.json(
//       { message: "Lỗi khi tạo đánh giá" },
//       { status: 500 }
//     );
//   }
// }

// Cho đánh giá nhiều lần
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

// Schema validation cho đánh giá
const ReviewSchema = z.object({
  idsanpham: z.number({
    required_error: "ID sản phẩm không được để trống",
  }),
  idUsers: z.number({
    required_error: "ID người dùng không được để trống",
  }),
  sao: z
    .number()
    .min(1, { message: "Số sao phải từ 1 đến 5" })
    .max(5, { message: "Số sao phải từ 1 đến 5" }),
  noidung: z
    .string()
    .min(1, { message: "Nội dung đánh giá không được để trống" })
    .max(45, { message: "Nội dung đánh giá tối đa 45 ký tự" }),
});

// GET - Lấy danh sách đánh giá cho sản phẩm
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsanpham = searchParams.get("idsanpham");

    if (!idsanpham) {
      return NextResponse.json(
        { message: "ID sản phẩm không được để trống" },
        { status: 400 }
      );
    }

    const reviews = await prisma.danhgia.findMany({
      where: {
        idsanpham: parseInt(idsanpham),
      },
      include: {
        users: {
          select: {
            Tentaikhoan: true,
            Hoten: true,
            // Avatar: true,
          },
        },
      },
      orderBy: {
        ngaydanhgia: "desc",
      },
    });

    return NextResponse.json({ data: reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Lỗi khi tải đánh giá" },
      { status: 500 }
    );
  }
}

// POST - Tạo đánh giá mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received review data:", body);

    // Validate dữ liệu đầu vào
    const validationResult = ReviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm và người dùng tồn tại
    const [product, user] = await Promise.all([
      prisma.sanpham.findUnique({
        where: { idsanpham: body.idsanpham },
      }),
      prisma.users.findUnique({
        where: { idUsers: body.idUsers },
      }),
    ]);

    if (!product || !user) {
      return NextResponse.json(
        { message: "Sản phẩm hoặc người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Tạo đánh giá mới (đã bỏ phần kiểm tra existingReview)
    const newReview = await prisma.danhgia.create({
      data: {
        idsanpham: body.idsanpham,
        idUsers: body.idUsers,
        sao: body.sao,
        noidung: body.noidung,
        ngaydanhgia: new Date(),
      },
      include: {
        users: {
          select: {
            Tentaikhoan: true,
            Hoten: true,
            // Avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: newReview, message: "Thêm đánh giá thành công" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Lỗi khi tạo đánh giá" },
      { status: 500 }
    );
  }
}
