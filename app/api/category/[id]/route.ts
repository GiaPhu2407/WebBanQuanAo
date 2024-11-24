import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import prisma from "@/prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idImage = parseInt(params.id, 10); // Lấy idImage từ URL
    if (isNaN(idImage)) {
      return NextResponse.json(
        { message: "idImage không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Xác thực dữ liệu đầu vào (bỏ idImage khỏi schema)
    const UpdateImageSchema = z.object({
      url: z.string().url({ message: "URL không hợp lệ" }).optional(),
      altText: z.string().max(255).optional(),
      idSanpham: z.number().int().optional(),
    });

    const validationResult = UpdateImageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: validationResult.error },
        { status: 400 }
      );
    }

    const { url, altText, idSanpham } = validationResult.data;

    // Kiểm tra nếu hình ảnh tồn tại
    const existingImage = await prisma.image.findUnique({
      where: { idImage },
    });

    if (!existingImage) {
      return NextResponse.json(
        { message: "Hình ảnh không tồn tại", code: "invalid_image_id" },
        { status: 404 }
      );
    }

    // Kiểm tra nếu sản phẩm liên kết tồn tại (nếu có idSanpham)
    if (idSanpham) {
      const sanphamExists = await prisma.sanpham.findUnique({
        where: { idsanpham: idSanpham },
      });

      if (!sanphamExists) {
        return NextResponse.json(
          {
            message: "Sản phẩm không tồn tại",
            code: "invalid_sanpham_id",
          },
          { status: 400 }
        );
      }
    }

    // Cập nhật thông tin hình ảnh
    const updatedImage = await prisma.image.update({
      where: { idImage },
      data: {
        url,
        altText,
        idSanpham,
      },
    });

    return NextResponse.json(
      { updatedImage, message: "Cập nhật hình ảnh thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in PUT:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}
// app/api/category/[id]/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Thêm console.log để debug
    console.log("Fetching product with ID:", id);

    // Fetch product with its associated images
    const product = await prisma.sanpham.findUnique({
      where: {
        idsanpham: id,
      },
      include: {
        images: true, // Đổi từ "images" thành "Image" để match với schema Prisma
      },
    });

    // Thêm console.log để kiểm tra kết quả
    console.log("Found product:", product);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin sản phẩm", details: error },
      { status: 500 }
    );
  }
}
