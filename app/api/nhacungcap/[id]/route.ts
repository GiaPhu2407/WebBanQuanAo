import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client"; // Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import { SupplierSchema } from "@/app/zodschema/route";

async function findNextAvailableId() {
  const allIds = await prisma.nhacungcap.findMany({
    select: { idnhacungcap: true },
    orderBy: { idnhacungcap: "asc" },
  });
  let nextId = 1;

  for (const record of allIds) {
    if (record.idnhacungcap !== nextId) {
      break;
    }
    nextId++;
  }

  return nextId;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let { id } = params;
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

    // Kiểm tra nếu ID có tồn tại trong cơ sở dữ liệu
    const supplierExists = await prisma.nhacungcap.findUnique({
      where: { idnhacungcap: parseInt(id) },
    });

    // Nếu không tồn tại, tìm ID tiếp theo chưa sử dụng và gán cho bản ghi này
    if (!supplierExists) {
      id = (await findNextAvailableId()).toString();
    }

    // Cập nhật nhà cung cấp với ID đã tồn tại hoặc ID tiếp theo chưa sử dụng
    const nhacungcap = await prisma.nhacungcap.upsert({
      where: { idnhacungcap: parseInt(id) },
      update: {
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai,
        diachi: body.diachi,
        email: body.email,
        trangthai: body.trangthai,
      },
      create: {
        idnhacungcap: parseInt(id),
        tennhacungcap: body.tennhacungcap,
        sodienthoai: body.sodienthoai,
        diachi: body.diachi,
        email: body.email,
        trangthai: body.trangthai,
      },
    });

    return NextResponse.json(
      { nhacungcap, message: "Cập nhật nhà cung cấp thành công" },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the supplier
    const deletedSupplier = await prisma.nhacungcap.delete({
      where: {
        idnhacungcap: parseInt(id),
      },
    });

    return NextResponse.json(
      { nhacungcap: deletedSupplier, message: "Xóa nhà cung cấp thành công" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in DELETE:", e);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi: " + e.message },
      { status: 500 }
    );
  }
}
