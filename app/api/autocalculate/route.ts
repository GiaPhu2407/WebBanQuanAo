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

// POST route to automatically calculate salary for all users for a specific month
export async function POST(req: NextRequest) {
  try {
    const { month, year, baseSalaryPerHour, defaultBonus } = await req.json();

    if (!month || !year || !baseSalaryPerHour) {
      return NextResponse.json(
        {
          message:
            "Vui lòng nhập đầy đủ thông tin (month, year, baseSalaryPerHour)",
        },
        { status: 400 }
      );
    }

    // Calculate start and end dates for the specified month
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);
    const ngaytinhluong = new Date(
      Number(year),
      Number(month) - 1,
      endDate.getDate()
    );

    // Get all users
    const users = await prisma.users.findMany();

    // Calculate and create salary records for each user
    const salaryRecords = await Promise.all(
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
        });

        // Calculate total work hours
        let totalWorkHours = 0;
        shifts.forEach((shift) => {
          totalWorkHours += calculateWorkHours(
            shift.giobatdau || "",
            shift.gioketthuc || ""
          );
        });

        // Calculate salary
        const luongcoban = new Decimal(baseSalaryPerHour);
        const tongluong = luongcoban.mul(totalWorkHours);

        // Handle bonus (`thuong`)
        const thuong = defaultBonus ? new Decimal(defaultBonus) : undefined; // Only add `thuong` if it is provided
        const finalTongluong = thuong ? tongluong.add(thuong) : tongluong;

        // Prepare the data object, omit `thuong` if not provided
        const salaryData: any = {
          idUsers: user.idUsers,
          luongcoban,
          ngaytinhluong,
          soca: shifts.length,
          tongluong: finalTongluong,
        };

        // Add the `thuong` field only if it's provided (not `undefined`)
        if (thuong !== undefined) {
          salaryData.thuong = thuong;
        }

        // Check if salary record already exists for this user and month
        const existingSalary = await prisma.luong.findFirst({
          where: {
            idUsers: user.idUsers,
            ngaytinhluong: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        let salaryRecord;

        if (existingSalary) {
          // Update existing record if found
          salaryRecord = await prisma.luong.update({
            where: {
              idLuong: existingSalary.idLuong,
            },
            data: salaryData, // Use the salaryData object, which may or may not contain `thuong`
            include: {
              users: true,
            },
          });
        } else {
          // Create new record if no existing record found
          salaryRecord = await prisma.luong.create({
            data: salaryData, // Use the salaryData object, which may or may not contain `thuong`
            include: {
              users: true,
            },
          });
        }

        return {
          userId: user.idUsers,
          userName: user.Tentaikhoan,
          totalShifts: shifts.length,
          totalWorkHours: totalWorkHours.toFixed(2),
          baseSalaryPerHour: luongcoban,
          totalSalary: finalTongluong,
          bonus: thuong,
          salaryRecord,
        };
      })
    );

    return NextResponse.json(
      {
        data: {
          month: Number(month),
          year: Number(year),
          records: salaryRecords,
        },
        message: "Tính lương tự động thành công cho tất cả nhân viên",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi tính lương tự động:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
