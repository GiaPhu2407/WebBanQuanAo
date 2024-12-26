import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ProductSchema } from "@/app/zodschema/route";
import { USER_NOT_EXIST } from "@/lib/constant";
import { Decimal } from "@prisma/client/runtime/library";

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
  const { id } = params;
  const sanphamId = id;
  try {
    const getSanpham = await prisma.sanpham.findUnique({
      where: {
        idsanpham: Number(sanphamId),
      },
      include: {
        loaisanpham: true,
        images: true,
        ProductSizes: {
          select: {
            soluong: true,
            size: {
              select: {
                idSize: true,
                tenSize: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(
      { getSanpham, message: "Lấy sản phẩm thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  const { id } = params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: "ID sản phẩm không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const {
      tensanpham,
      mota,
      gia,
      mausac,
      idloaisanpham,
      giamgia,
      gioitinh,
      trangthai,
      productSizes,
      hinhanh
    } = await request.json();

    // Validate required fields
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

    // Update product
    const updatedProduct = await prisma.sanpham.update({
      where: { idsanpham: productId },
      data: {
        tensanpham,
        mota,
        gia: String(gia),
        mausac,
        idloaisanpham: Number(idloaisanpham),
        giamgia: giamgia ? Number(giamgia) : null,
        gioitinh,
        trangthai,
        hinhanh,
        ProductSizes: {
          deleteMany: {},
          create: formattedSizes,
        },
      },
      include: {
        ProductSizes: true,
        loaisanpham: true
      }
    });

    return NextResponse.json({
      data: updatedProduct,
      message: "Cập nhật sản phẩm thành công",
    }, { status: 200 });

  } catch (error: any) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}