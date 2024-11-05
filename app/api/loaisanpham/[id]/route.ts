import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
// import UserSchema from "@/app/zodschema/route";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idloaisanpham = parseInt(params.id);

  try {
    const xe = await prisma.sanpham.findMany({
      where: {
        idloaisanpham: idloaisanpham,
      },
      include: {
        loaisanpham: true,
      },
    });

    return NextResponse.json(xe);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// Define schema to validate input data
const UserSchema = z.object({
  tenloai: z.string().max(255),
  mota: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received PUT request with params:", params);

    const body = await request.json();
    console.log("Request body:", body);

    const idsanpham = parseInt(params.id);
    console.log("Parsed idsanpham:", idsanpham);

    if (isNaN(idsanpham)) {
      console.error("Invalid id format:", params.id);
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Validate input data
    const validation = UserSchema.safeParse({
      tenloai: body.tenloai,
      mota: body.mota,
    });

    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if product category with the same name exists
    const existingLoaisanpham = await prisma.loaisanpham.findUnique({
      where: { tenloai: body.tenloai },
    });
    console.log("Existing product category:", existingLoaisanpham);

    if (
      existingLoaisanpham &&
      existingLoaisanpham.idloaisanpham !== idsanpham
    ) {
      return NextResponse.json(
        { error: "Tên loại sản phẩm đã tồn tại" },
        { status: 400 }
      );
    }

    // Update the product category
    const updatedLoaisanpham = await prisma.loaisanpham.update({
      where: { idloaisanpham: idsanpham },
      data: {
        tenloai: body.tenloai,
        mota: body.mota,
      },
    });
    console.log("Updated product category:", updatedLoaisanpham);

    return NextResponse.json(
      { message: `Cập nhật loại sản phẩm ID ${params.id} thành công` },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT request error:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật loại sản phẩm" },
      { status: 500 }
    );
  }
}
