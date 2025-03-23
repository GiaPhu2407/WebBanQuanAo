import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";

// GET CaLamViec by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const caLamViecId = Number(id);

  if (isNaN(caLamViecId)) {
    return NextResponse.json(
      { error: "ID ca làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const caLamViec = await prisma.caLamViec.findUnique({
      where: {
        idCaLamViec: caLamViecId,
      },
      include: {
        users: true,
      },
    });

    if (!caLamViec) {
      return NextResponse.json(
        { message: "Không tìm thấy ca làm việc" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: caLamViec, message: "Lấy ca làm việc thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) CaLamViec by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const caLamViecId = Number(id);

  if (isNaN(caLamViecId)) {
    return NextResponse.json(
      { error: "ID ca làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const { idUsers, ngaylam, giobatdau, gioketthuc, DiaDiem } =
      await request.json();

    // Validation
    if (!idUsers || !ngaylam || !giobatdau || !gioketthuc) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Start a transaction to update both records
    const [updatedCaLamViec, updatedLichLamViec] = await prisma.$transaction(
      async (tx) => {
        // Update Ca Làm Việc
        const caLamViec = await tx.caLamViec.update({
          where: {
            idCaLamViec: caLamViecId,
          },
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

        // Find existing LichLamViec
        const existingLichLamViec = await tx.lichLamViec.findFirst({
          where: { idCaLamViec: caLamViecId },
        });

        // Prepare dates for LichLamViec
        const ngayLamViecDate = new Date(ngaylam);
        const [startHours, startMinutes] = giobatdau.split(":").map(Number);
        const gioBatDauDate = new Date(ngayLamViecDate);
        gioBatDauDate.setHours(startHours, startMinutes, 0);

        const [endHours, endMinutes] = gioketthuc.split(":").map(Number);
        const gioKetThucDate = new Date(ngayLamViecDate);
        gioKetThucDate.setHours(endHours, endMinutes, 0);

        let lichLamViec;
        if (existingLichLamViec) {
          // Update existing LichLamViec
          lichLamViec = await tx.lichLamViec.update({
            where: { idLichLamViec: existingLichLamViec.idLichLamViec },
            data: {
              idUsers: Number(idUsers),
              NgayLamViec: ngayLamViecDate,
              GioBatDau: gioBatDauDate,
              GioKetThuc: gioKetThucDate,
              DiaDiem: DiaDiem || "",
            },
            include: {
              user: true,
            },
          });
        } else {
          // Create new LichLamViec if it doesn't exist
          lichLamViec = await tx.lichLamViec.create({
            data: {
              idUsers: Number(idUsers),
              NgayLamViec: ngayLamViecDate,
              GioBatDau: gioBatDauDate,
              GioKetThuc: gioKetThucDate,
              DiaDiem: DiaDiem || "",
              idCaLamViec: caLamViecId,
            },
            include: {
              user: true,
            },
          });
        }

        // Create notification for updated schedule
        const notification = await tx.notification.create({
          data: {
            idUsers: Number(idUsers),
            title: "Cập nhật ca làm việc",
            message: `Ca làm việc của bạn đã được cập nhật: Ngày ${ngayLamViecDate.toLocaleDateString(
              "vi-VN"
            )} từ ${giobatdau} đến ${gioketthuc}${
              DiaDiem ? ` tại ${DiaDiem}` : ""
            }`,
            type: "work_schedule_update",
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
        data: { caLamViec: updatedCaLamViec, lichLamViec: updatedLichLamViec },
        message: "Cập nhật ca làm việc và lịch làm việc thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi cập nhật ca làm việc:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE CaLamViec by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const caLamViecId = Number(id);

  if (isNaN(caLamViecId)) {
    return NextResponse.json(
      { error: "ID ca làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    // Get the ca làm việc details before deletion for notification
    const caLamViec = await prisma.caLamViec.findUnique({
      where: { idCaLamViec: caLamViecId },
      include: { users: true },
    });

    if (!caLamViec) {
      return NextResponse.json(
        { message: "Không tìm thấy ca làm việc" },
        { status: 404 }
      );
    }

    // Delete both records in a transaction
    await prisma.$transaction([
      prisma.lichLamViec.deleteMany({
        where: { idCaLamViec: caLamViecId },
      }),
      prisma.caLamViec.delete({
        where: { idCaLamViec: caLamViecId },
      }),
    ]);

    // Create notification for deleted schedule
    // Create notification for deleted schedule
    const notification = await prisma.notification.create({
      data: {
        idUsers: caLamViec.idUsers,
        title: "Hủy ca làm việc",
        message: caLamViec.ngaylam
          ? `Ca làm việc ngày ${new Date(caLamViec.ngaylam).toLocaleDateString(
              "vi-VN"
            )} đã bị hủy`
          : "Ca làm việc đã bị hủy",
        type: "work_schedule_cancel",
        isRead: false,
      },
    });

    // Trigger real-time notification
    await pusherServer.trigger(
      "notifications",
      "new-notification",
      notification
    );

    return NextResponse.json(
      { message: "Xoá ca làm việc và lịch làm việc thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
