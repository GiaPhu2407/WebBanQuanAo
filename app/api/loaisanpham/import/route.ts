// app/api/loaisanpham/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Thực hiện bulk create với Prisma
    const importedData = await prisma.loaisanpham.createMany({
      data: data.map((item: { tenloai: string; mota: string }) => ({
        tenloai: item.tenloai,
        mota: item.mota,
      })),
      skipDuplicates: true, // Bỏ qua nếu có dữ liệu trùng lặp
    });

    return NextResponse.json({
      message: `Đã import ${importedData.count} loại sản phẩm thành công`,
      count: importedData.count,
    }, { status: 201 });
  } catch (error) {
    console.error("Error importing products:", error);
    return NextResponse.json(
      { error: "Lỗi khi import dữ liệu" },
      { status: 500 }
    );
  }
}