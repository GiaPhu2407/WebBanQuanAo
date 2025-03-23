import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Helper function to calculate work hours between two times
function calculateWorkHours(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  return hours + minutes / 60;
}

// GET salary calculation for a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "ID người dùng không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    // Get the user
    const user = await prisma.users.findUnique({
      where: {
        idUsers: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Get the latest salary record for the user
    const latestSalary = await prisma.luong.findFirst({
      where: {
        idUsers: userId,
      },
      orderBy: {
        ngaytinhluong: "desc",
      },
    });

    // Get all shifts for the user
    const shifts = await prisma.caLamViec.findMany({
      where: {
        idUsers: userId,
      },
      orderBy: {
        ngaylam: "asc",
      },
    });

    // Calculate total work hours
    let totalWorkHours = 0;
    const shiftDetails = shifts.map((shift) => {
      const workHours = calculateWorkHours(shift.giobatdau!, shift.gioketthuc!);
      totalWorkHours += workHours;

      return {
        date: shift.ngaylam,
        startTime: shift.giobatdau,
        endTime: shift.gioketthuc,
        workHours: workHours.toFixed(2),
      };
    });

    // Calculate total salary based on the latest salary record
    const hourlyRate = latestSalary?.luongcoban || new Decimal(0);
    const totalSalary = hourlyRate.mul(totalWorkHours);
    const bonus = latestSalary?.thuong || new Decimal(0);
    const finalSalary = totalSalary.add(bonus);

    const result = {
      userId: userId,
      userName: user.Tentaikhoan,
      totalShifts: shifts.length,
      totalWorkHours: totalWorkHours.toFixed(2),
      hourlyRate: hourlyRate,
      baseSalary: totalSalary,
      bonus: bonus,
      totalSalary: finalSalary,
      shiftDetails: shiftDetails,
      latestSalaryRecord: latestSalary,
    };

    return NextResponse.json(
      {
        data: result,
        message: "Lấy thông tin lương thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin lương:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
