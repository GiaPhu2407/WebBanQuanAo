import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Helper function to calculate total salary
async function calculateTotalSalary(
  userId: number,
  startDate: Date,
  endDate: Date,
  baseSalary: Decimal
) {
  try {
    // Count the number of shifts for the user in the given date range
    const caLamViec = await prisma.caLamViec.findMany({
      where: {
        idUsers: userId,
        ngaylam: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const soCa = caLamViec.length;

    // Calculate total salary (base salary * number of shifts)
    const tongLuong = new Decimal(baseSalary).mul(soCa);

    return {
      soCa,
      tongLuong,
    };
  } catch (error) {
    console.error("Error calculating total salary:", error);
    throw error;
  }
}

// GET all Luong
export async function GET() {
  try {
    const luong = await prisma.luong.findMany({
      include: {
        users: true,
      },
    });

    return NextResponse.json(
      { data: luong, message: "Lấy danh sách lương thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách lương" },
      { status: 500 }
    );
  }
}

// POST new Luong
export async function POST(req: NextRequest) {
  try {
    const { idUsers, luongcoban, thuong, ngaytinhluong } = await req.json();

    // Validation
    if (!idUsers || !luongcoban || !ngaytinhluong) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const startDate = new Date(ngaytinhluong);
    startDate.setDate(1); // First day of the month

    const endDate = new Date(ngaytinhluong);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    // Calculate total salary
    const { soCa, tongLuong } = await calculateTotalSalary(
      Number(idUsers),
      startDate,
      endDate,
      new Decimal(luongcoban)
    );

    // Add bonus if provided
    const finalTongLuong = thuong
      ? tongLuong.add(new Decimal(thuong))
      : tongLuong;

    // Construct the data object, omit 'thuong' if not provided
    const newLuongData: any = {
      idUsers: Number(idUsers),
      luongcoban: new Decimal(luongcoban),
      ngaytinhluong: new Date(ngaytinhluong),
      soca: soCa,
      tongluong: finalTongLuong,
    };

    // Only add the 'thuong' field if it is provided
    if (thuong !== undefined) {
      newLuongData.thuong = new Decimal(thuong);
    }

    const newLuong = await prisma.luong.create({
      data: newLuongData,
      include: {
        users: true,
      },
    });

    return NextResponse.json(
      {
        data: newLuong,
        message: "Tính lương thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tính lương:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE all Luong
export async function DELETE() {
  try {
    await prisma.luong.deleteMany();

    return NextResponse.json({
      message: "Xoá tất cả dữ liệu lương thành công",
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Lỗi khi xoá dữ liệu lương: " + error.message },
      { status: 500 }
    );
  }
}
