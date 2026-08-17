import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Helper function to calculate work hours between two times
function calculateWorkHours(startTime: string, endTime: string) {
  if (!startTime || !endTime) return 0;

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

// POST route to get monthly salary report
export async function POST(req: NextRequest) {
  try {
    const { month, year } = await req.json();

    if (!month || !year) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin (month, year)" },
        { status: 400 }
      );
    }

    // Calculate start and end dates for the specified month
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    // Get all users
    const users = await prisma.users.findMany();

    // Calculate salary for each user
    const salaryReports = await Promise.all(
      users.map(async (user) => {
        // Get all shifts for the user within the date range
        const shifts = await prisma.caLamViec.findMany({
          where: {
            idUsers: user.idUsers,
            ngaylam: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: {
            ngaylam: "asc",
          },
        });

        // Get the latest salary record for the user
        const latestSalary = await prisma.luong.findFirst({
          where: {
            idUsers: user.idUsers,
          },
          orderBy: {
            ngaytinhluong: "desc",
          },
        });

        // Calculate total work hours
        let totalWorkHours = 0;
        const shiftDetails = shifts.map((shift) => {
          const workHours = calculateWorkHours(
            shift.giobatdau || "",
            shift.gioketthuc || ""
          );
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

        return {
          userId: user.idUsers,
          userName: user.Tentaikhoan,
          totalShifts: shifts.length,
          totalWorkHours: totalWorkHours.toFixed(2),
          hourlyRate: hourlyRate,
          baseSalary: totalSalary,
          bonus: bonus,
          totalSalary: finalSalary,
          shiftDetails: shiftDetails,
        };
      })
    );

    return NextResponse.json(
      {
        data: {
          month: Number(month),
          year: Number(year),
          startDate: startDate,
          endDate: endDate,
          reports: salaryReports,
        },
        message: "Báo cáo lương tháng thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tạo báo cáo lương:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
