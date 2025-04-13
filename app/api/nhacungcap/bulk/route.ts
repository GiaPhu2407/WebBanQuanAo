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
    let insertedCount = 0;
    let failedItems: Array<{
      tennhacungcap: string;
      sodienthoai: string;
      email: string;
      reason: string;
    }> = [];

    // Regex patterns for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const { tennhacungcap, sodienthoai, diachi, email, trangthai } = item;

        // Kiểm tra dữ liệu hợp lệ
        if (!tennhacungcap || !sodienthoai || !diachi || !email) {
          failedItems.push({
            tennhacungcap: tennhacungcap || "",
            sodienthoai: sodienthoai || "",
            email: email || "",
            reason: "Thiếu thông tin bắt buộc",
          });
          continue;
        }

        // Kiểm tra định dạng email
        if (!emailRegex.test(email)) {
          failedItems.push({
            tennhacungcap,
            sodienthoai,
            email,
            reason: "Email không hợp lệ",
          });
          continue;
        }

        // Kiểm tra định dạng số điện thoại
        if (!phoneRegex.test(sodienthoai)) {
          failedItems.push({
            tennhacungcap,
            sodienthoai,
            email,
            reason: "Số điện thoại không hợp lệ",
          });
          continue;
        }

        // Kiểm tra nhà cung cấp đã tồn tại chưa (theo email hoặc số điện thoại)
        const existingSupplier = await tx.nhacungcap.findFirst({
          where: {
            OR: [{ email: email.toLowerCase() }, { sodienthoai: sodienthoai }],
          },
        });

        if (existingSupplier) {
          failedItems.push({
            tennhacungcap,
            sodienthoai,
            email,
            reason: "Email hoặc số điện thoại đã tồn tại",
          });
          continue;
        }

        // Thêm nhà cung cấp mới
        await tx.nhacungcap.create({
          data: {
            tennhacungcap,
            sodienthoai,
            diachi,
            email: email.toLowerCase(),
            trangthai: trangthai === true || trangthai === "true",
          },
        });
        insertedCount++;
      }

      return {
        success: true,
        insertedCount,
        failedCount: failedItems.length,
        failedItems,
      };
    });

    // Trả về kết quả thành công
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi thực hiện bulk insert nhà cung cấp:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi khi nhập dữ liệu nhà cung cấp",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
