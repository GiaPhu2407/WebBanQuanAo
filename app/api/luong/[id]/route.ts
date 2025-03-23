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

// GET Luong by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const luongId = Number(id);

  if (isNaN(luongId)) {
    return NextResponse.json(
      { error: "ID lương không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const luong = await prisma.luong.findUnique({
      where: {
        idLuong: luongId,
      },
      include: {
        users: true,
      },
    });

    if (!luong) {
      return NextResponse.json(
        { message: "Không tìm thấy dữ liệu lương" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: luong, message: "Lấy dữ liệu lương thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) Luong by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const luongId = Number(id);

  if (isNaN(luongId)) {
    return NextResponse.json(
      { error: "ID lương không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const { idUsers, luongcoban, thuong, ngaytinhluong } = await request.json();

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

    // Handle the bonus (`thuong`) and set it to `undefined` if not provided
    const finalTongLuong = thuong
      ? tongLuong.add(new Decimal(thuong))
      : tongLuong;

    const updatedLuong = await prisma.luong.update({
      where: {
        idLuong: luongId,
      },
      data: {
        idUsers: Number(idUsers),
        luongcoban: new Decimal(luongcoban),
        thuong: thuong ? new Decimal(thuong) : undefined, // If `thuong` is null or not provided, set it as `undefined`
        ngaytinhluong: new Date(ngaytinhluong),
        soca: soCa,
        tongluong: finalTongLuong,
      },
      include: {
        users: true, // Include the `users` relation to fetch user details
      },
    });

    return NextResponse.json(
      {
        data: updatedLuong,
        message: "Cập nhật lương thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi cập nhật lương:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Luong by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const luongId = Number(id);

  if (isNaN(luongId)) {
    return NextResponse.json(
      { error: "ID lương không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    await prisma.luong.delete({
      where: {
        idLuong: luongId,
      },
    });

    return NextResponse.json(
      { message: "Xoá dữ liệu lương thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
