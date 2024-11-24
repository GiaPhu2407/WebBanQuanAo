import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema xác thực dữ liệu đầu vào
const ImageSchema = z.object({
  url: z.string().url({ message: "URL không hợp lệ" }),
  altText: z
    .string()
    .max(255, { message: "Mô tả altText không được vượt quá 255 ký tự" })
    .optional(),
  idSanpham: z
    .number()
    .int({ message: "ID sản phẩm phải là một số nguyên" })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request
    const body = await req.json();
    console.log("Dữ liệu nhận được:", body); // Log dữ liệu để debug

    // Xác thực dữ liệu đầu vào bằng Zod
    const validationResult = ImageSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error);
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { url, altText, idSanpham } = validationResult.data;

    // Kiểm tra sản phẩm liên kết nếu có `idSanpham`
    if (idSanpham) {
      const sanphamExists = await prisma.sanpham.findUnique({
        where: { idsanpham: idSanpham },
      });

      if (!sanphamExists) {
        console.error(`Sản phẩm với ID ${idSanpham} không tồn tại`);
        return NextResponse.json(
          { error: "Sản phẩm không tồn tại", code: "invalid_sanpham_id" },
          { status: 400 }
        );
      }
    }

    // Tạo bản ghi hình ảnh mới trong cơ sở dữ liệu
    const image = await prisma.image.create({
      data: {
        url,
        altText: altText || null,
        idSanpham: idSanpham || null,
      },
    });

    console.log("Hình ảnh đã được thêm thành công:", image);
    return NextResponse.json(
      { image, message: "Thêm hình ảnh thành công" },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error in POST:", e);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trên server", details: e.message },
      { status: 500 }
    );
  }
}

// Endpoint GET: Lấy tất cả các hình ảnh
// export async function GET(req: NextRequest) {
//   try {
//     const images = await prisma.image.findMany();
//     return NextResponse.json(images);
//   } catch (e: any) {
//     console.error("Error in GET:", e);
//     return NextResponse.json(
//       { error: "Không thể lấy danh sách hình ảnh", details: e.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  const image = await prisma.image.findMany();
  return NextResponse.json(image);
}
