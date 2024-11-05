import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ProductSchema } from "@/app/zodschema/route";
import { USER_NOT_EXIST } from "@/lib/constant";

async function checkProductExists(id: number) {
  const product = await prisma.sanpham.findUnique({
    where: { idsanpham: id },
  });
  return product !== null;
}

// Helper function để cập nhật lại các ID
async function reorderProductIds() {
  try {
    const products = await prisma.sanpham.findMany({
      orderBy: { idsanpham: "asc" },
    });

    // Re-assign IDs sequentially
    for (let i = 0; i < products.length; i++) {
      await prisma.sanpham.update({
        where: { idsanpham: products[i].idsanpham },
        data: { idsanpham: i + 1 },
      });
    }
  } catch (error) {
    console.error("Error while reordering product IDs:", error);
    throw error;
  }
}

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

// In your helper file (server-side logic for database)

// In your DELETE handler, call reorderProductIds after deleting a productexport async function DELETE(
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id);
  try {
    const deleteUser = await prisma.sanpham.delete({
      where: { idsanpham: userId },
    });
    return NextResponse.json({ deleteUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error_code: USER_NOT_EXIST.error_code, cause: USER_NOT_EXIST.message },
      { status: 400 }
    );
  }
}

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

    // Check if the product exists
    const existingProduct = await prisma.sanpham.findUnique({
      where: { idsanpham: id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm để cập nhật" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input data similar to POST
    const validationResult = ProductSchema.safeParse({
      tensanpham: body.tensanpham,
      mota: body.mota,
      gia: body.gia,
      hinhanh: body.hinhanh,
      idloaisanpham: parseInt(body.idloaisanpham),
      giamgia: parseFloat(body.giamgia),
      gioitinh: body.gioitinh, // Expecting a boolean value directly
      size: body.size,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: validationResult.error },
        { status: 400 }
      );
    }

    // Check for duplicate product name
    const duplicateProduct = await prisma.sanpham.findFirst({
      where: {
        tensanpham: body.tensanpham,
        NOT: {
          idsanpham: id,
        },
      },
    });

    if (duplicateProduct) {
      return NextResponse.json(
        { error: "Tên sản phẩm đã tồn tại" },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await prisma.sanpham.update({
      where: { idsanpham: id },
      data: {
        tensanpham: body.tensanpham,
        mota: body.mota,
        gia: body.gia, // Ensure that this is a number
        hinhanh: body.hinhanh,
        idloaisanpham: parseInt(body.idloaisanpham),
        giamgia: parseFloat(body.giamgia),
        gioitinh: body.gioitinh, // Expecting a boolean
        size: body.size,
      },
    });

    return NextResponse.json({
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}
