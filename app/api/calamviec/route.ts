import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";

// GET all CaLamViec
export async function GET() {
  try {
    const caLamViec = await prisma.caLamViec.findMany({
      include: {
        users: true,
      },
    });

    return NextResponse.json(caLamViec, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách ca làm việc" },
      { status: 500 }
    );
  }
}

// POST new CaLamViec
export async function POST(req: NextRequest) {
  try {
    const { idUsers, ngaylam, giobatdau, gioketthuc, DiaDiem } =
      await req.json();

    // Validation
    if (!idUsers || !ngaylam || !giobatdau || !gioketthuc) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Start a transaction to create both records
    const [newCaLamViec, newLichLamViec] = await prisma.$transaction(
      async (tx) => {
        // Create Ca Làm Việc
        const caLamViec = await tx.caLamViec.create({
          data: {
            idUsers: Number(idUsers),
            ngaylam: new Date(ngaylam),
            giobatdau,
            gioketthuc,
          },
          include: {
            users: true,
          },
        });

        // Create corresponding Lịch Làm Việc
        const ngayLamViecDate = new Date(ngaylam);
        const [startHours, startMinutes] = giobatdau.split(":").map(Number);
        const gioBatDauDate = new Date(ngayLamViecDate);
        gioBatDauDate.setHours(startHours, startMinutes, 0);

        const [endHours, endMinutes] = gioketthuc.split(":").map(Number);
        const gioKetThucDate = new Date(ngayLamViecDate);
        gioKetThucDate.setHours(endHours, endMinutes, 0);

        const lichLamViec = await tx.lichLamViec.create({
          data: {
            idUsers: Number(idUsers),
            NgayLamViec: ngayLamViecDate,
            GioBatDau: gioBatDauDate,
            GioKetThuc: gioKetThucDate,
            DiaDiem: DiaDiem || "",
            idCaLamViec: caLamViec.idCaLamViec,
          },
          include: {
            user: true,
          },
        });

        // Create notification
        const notification = await tx.notification.create({
          data: {
            idUsers: Number(idUsers),
            title: "Ca làm việc mới",
            message: `Bạn có ca làm việc mới vào ngày ${ngayLamViecDate.toLocaleDateString(
              "vi-VN"
            )} từ ${giobatdau} đến ${gioketthuc}${
              DiaDiem ? ` tại ${DiaDiem}` : ""
            }`,
            type: "work_schedule",
            isRead: false,
          },
        });

        // Trigger real-time notification
        await pusherServer.trigger(
          "notifications",
          "new-notification",
          notification
        );

        return [caLamViec, lichLamViec];
      }
    );

    return NextResponse.json(
      {
        data: { caLamViec: newCaLamViec, lichLamViec: newLichLamViec },
        message: "Thêm ca làm việc và lịch làm việc thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi thêm ca làm việc:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE all CaLamViec
export async function DELETE() {
  try {
    await prisma.$transaction([
      prisma.lichLamViec.deleteMany(),
      prisma.caLamViec.deleteMany(),
    ]);

    return NextResponse.json({
      message: "Xoá tất cả ca làm việc và lịch làm việc thành công",
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Lỗi khi xoá ca làm việc: " + error.message },
      { status: 500 }
    );
  }
}
