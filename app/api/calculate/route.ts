import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Helper function to calculate work hours between two times
function calculateWorkHours(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return 0; // Return 0 if either startTime or endTime is null

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

// POST route to calculate salary for a specific user for a given month
export async function POST(req: NextRequest) {
  try {
    const { userId, month, year, baseSalaryPerHour, defaultBonus } = await req.json();

    if (!userId || !month || !year || !baseSalaryPerHour) {
      return NextResponse.json(
        {
          message: "Vui lòng nhập đầy đủ thông tin (userId, month, year, baseSalaryPerHour)",
        },
        { status: 400 }
      );
    }

    // Calculate start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    // Get all shifts for the user within the date range
    const shifts = await prisma.caLamViec.findMany({
      where: {
        idUsers: Number(userId),
        ngaylam: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        ngaylam: "asc",
      },
      include: {
        users: true,
      },
    });

    // Calculate total work hours and total salary
    let totalWorkHours = 0;
    const shiftDetails = shifts.map((shift) => {
      // Ensure the time values are not null before calculating work hours
      const workHours = calculateWorkHours(shift.giobatdau, shift.gioketthuc);
      totalWorkHours += workHours;

      return {
        date: shift.ngaylam,
        startTime: shift.giobatdau,
        endTime: shift.gioketthuc,
        workHours: workHours.toFixed(2),
        giobatdau: shift.giobatdau,
        gioketthuc: shift.gioketthuc,
      };
    });

    const baseSalary = new Decimal(baseSalaryPerHour).mul(totalWorkHours);
    const bonus = defaultBonus ? new Decimal(defaultBonus) : new Decimal(0);
    const totalSalary = baseSalary.add(bonus);

    // Get user information
    const user = await prisma.users.findUnique({
      where: {
        idUsers: Number(userId),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin người dùng" },
        { status: 404 }
      );
    }

    const result = {
      idUsers: Number(userId),
      userName: user.Tentaikhoan,
      totalShifts: shifts.length,
      totalWorkHours: totalWorkHours.toFixed(2),
      hourlyRate: new Decimal(baseSalaryPerHour),
      baseSalary: baseSalary,
      bonus: bonus,
      totalSalary: totalSalary,
      shiftDetails: shiftDetails,
    };

    // Save salary record
    const salaryRecord = await prisma.luong.create({
      data: {
        idUsers: Number(userId),
        luongcoban: baseSalary,
        thuong: bonus,
        ngaytinhluong: new Date(),
        soca: shifts.length,
        tongluong: totalSalary,
      },
    });

    return NextResponse.json(
      {
        data: result,
        message: "Tính lương thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tính lương:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
