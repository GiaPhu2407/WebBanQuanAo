// File: /app/api/loaisanpham/bulk/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    // Khởi tạo biến để theo dõi
    let successCount = 0;
    let failedItems: Array<{ tenloai: string; mota: string; reason: string }> =
      [];

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const { tenloai, mota } = item;

        // Kiểm tra dữ liệu hợp lệ
        if (!tenloai || !mota) {
          failedItems.push({
            tenloai: tenloai || "",
            mota: mota || "",
            reason: "Thiếu tên loại hoặc mô tả",
          });
          continue;
        }

        // Kiểm tra tên loại đã tồn tại chưa
        const existingItem = await tx.loaisanpham.findFirst({
          where: {
            tenloai: {
              equals: tenloai.toLowerCase(),
            },
          },
        });

        if (existingItem) {
          failedItems.push({
            tenloai,
            mota,
            reason: "Tên loại đã tồn tại",
          });
          continue;
        }

        // Thêm loại sản phẩm mới
        await tx.loaisanpham.create({
          data: {
            tenloai,
            mota,
          },
        });

        successCount++;
      }

      return {
        success: true,
        insertedCount: successCount,
        failedCount: failedItems.length,
        failedItems: failedItems,
      };
    });

    // Trả về kết quả thành công
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi thực hiện bulk insert loại sản phẩm:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi khi nhập dữ liệu loại sản phẩm",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
