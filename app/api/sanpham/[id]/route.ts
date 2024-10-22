import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod"; // Để validation

// Schema validation cho sản phẩm
const ProductSchema = z.object({
  tensanpham: z.string().min(1, "Tên sản phẩm không được để trống"),
  mota: z.string().optional(),
  gia: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Giá không được âm")
  ), // Chuyển chuỗi thành số
  hinhanh: z.string().optional(),
  idloaisanpham: z.number(),
  giamgia: z.number().min(0).max(100).optional(),
});

// Hàm helper để kiểm tra sự tồn tại của sản phẩm
async function checkProductExists(id: number) {
  const product = await prisma.sanpham.findUnique({
    where: { idsanpham: id },
  });
  return product !== null;
}

// GET - Lấy thông tin sản phẩm
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const sanpham = await prisma.sanpham.findUnique({
      where: { idsanpham: id },
      include: {
        loaisanpham: true,
      },
    });

    if (!sanpham) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json(sanpham);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin sản phẩm" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const exists = await checkProductExists(id);
    if (!exists) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm để xóa" },
        { status: 404 }
      );
    }

    const sanpham = await prisma.sanpham.delete({
      where: { idsanpham: id },
    });

    return NextResponse.json(
      { message: "Xóa sản phẩm thành công", data: sanpham },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa sản phẩm" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật sản phẩm
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const exists = await checkProductExists(id);
    if (!exists) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm để cập nhật" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate dữ liệu đầu vào
    const validationResult = ProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: validationResult.error },
        { status: 400 }
      );
    }

    // Kiểm tra tên sản phẩm trùng
    const existingProduct = await prisma.sanpham.findFirst({
      where: {
        tensanpham: body.tensanpham,
        NOT: { idsanpham: id },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Tên sản phẩm đã tồn tại" },
        { status: 400 }
      );
    }

    // Cập nhật sản phẩm
    const updatedProduct = await prisma.sanpham.update({
      where: { idsanpham: id },
      data: {
        tensanpham: body.tensanpham,
        mota: body.mota,
        gia: body.gia,
        hinhanh: body.hinhanh,
        idloaisanpham: body.idloaisanpham,
        giamgia: body.giamgia,
      },
    });

    return NextResponse.json(
      {
        message: "Cập nhật sản phẩm thành công",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}
