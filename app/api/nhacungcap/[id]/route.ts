import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { SupplierSchema } from "@/app/zodschema/route"; // Đảm bảo đường dẫn chính xác

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const validationResult = SupplierSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem `idnhacungcap` có được cung cấp không
    if (!body.idnhacungcap || typeof body.idnhacungcap !== "number") {
      return NextResponse.json(
        { error: "ID nhà cung cấp không hợp lệ hoặc không được cung cấp" },
        { status: 400 }
      );
    }

    // Kiểm tra xem `idnhacungcap` mới có trùng với ID đã có trong cơ sở dữ liệu không
    const existingSupplier = await prisma.nhacungcap.findUnique({
      where: { idnhacungcap: body.idnhacungcap },
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { message: "Không tìm thấy nhà cung cấp với ID đã cung cấp" },
        { status: 404 }
      );
    }

    // Kiểm tra nếu có yêu cầu thay đổi ID (cập nhật lại ID)
    if (body.newIdnhacungcap && typeof body.newIdnhacungcap === "number") {
      // Kiểm tra xem ID mới đã tồn tại chưa
      const idExists = await prisma.nhacungcap.findUnique({
        where: { idnhacungcap: body.newIdnhacungcap },
      });

      if (idExists) {
        return NextResponse.json(
          { error: "ID mới đã tồn tại trong cơ sở dữ liệu" },
          { status: 400 }
        );
      }

      // Cập nhật lại ID và các trường khác
      const nhacungcap = await prisma.nhacungcap.update({
        where: { idnhacungcap: body.idnhacungcap },
        data: {
          idnhacungcap: body.newIdnhacungcap, // Cập nhật ID mới
          tennhacungcap: body.tennhacungcap,
          sodienthoai: body.sodienthoai,
          diachi: body.diachi,
          email: body.email,
          trangthai: body.trangthai, // true cho "Đang cung cấp", false cho "Ngừng cung cấp"
        },
      });

      return NextResponse.json(
        { nhacungcap, message: "Cập nhật nhà cung cấp thành công" },
        { status: 200 }
      );
    }

    // Cập nhật nếu không có thay đổi ID
    const nhacungcap = await prisma.nhacungcap.update({
      where: { idnhacungcap: body.idnhacungcap },
      data: {
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai,
        diachi: body.diachi,
        email: body.email,
        trangthai: body.trangthai, // true cho "Đang cung cấp", false cho "Ngừng cung cấp"
      },
    });

    return NextResponse.json(
      { nhacungcap, message: "Cập nhật nhà cung cấp thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in PUT:", e);
    if (e.code === "P2025") {
      // Lỗi Prisma khi không tìm thấy bản ghi cần cập nhật
      return NextResponse.json(
        { message: "Không tìm thấy nhà cung cấp với ID đã cung cấp" },
        { status: 404 }
      );
    } else {
      // Lỗi chung khác
      return NextResponse.json(
        { message: "Đã xảy ra lỗi: " + e.message },
        { status: 500 }
      );
    }
  }
}
