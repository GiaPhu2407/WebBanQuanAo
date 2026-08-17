import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const lichLamViecId = Number(id);

  if (isNaN(lichLamViecId)) {
    return NextResponse.json(
      { error: "ID lịch làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const lichLamViec = await prisma.lichLamViec.findUnique({
      where: {
        idLichLamViec: lichLamViecId,
      },
      include: {
        user: true,
        caLamViec: true,
      },
    });

    if (!lichLamViec) {
      return NextResponse.json(
        { message: "Không tìm thấy lịch làm việc" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: lichLamViec, message: "Lấy lịch làm việc thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const lichLamViecId = Number(id);

  if (isNaN(lichLamViecId)) {
    return NextResponse.json(
      { error: "ID lịch làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const { idUsers, NgayLamViec, GioBatDau, GioKetThuc, DiaDiem } =
      await request.json();

    if (!idUsers || !NgayLamViec || !GioBatDau || !GioKetThuc) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const ngayLamViecDate = new Date(NgayLamViec);
    const [startHours, startMinutes] = GioBatDau.split(":").map(Number);
    const gioBatDauDate = new Date(ngayLamViecDate);
    gioBatDauDate.setHours(startHours, startMinutes, 0);

    const [endHours, endMinutes] = GioKetThuc.split(":").map(Number);
    const gioKetThucDate = new Date(ngayLamViecDate);
    gioKetThucDate.setHours(endHours, endMinutes, 0);

    if (
      isNaN(ngayLamViecDate.getTime()) ||
      isNaN(gioBatDauDate.getTime()) ||
      isNaN(gioKetThucDate.getTime())
    ) {
      return NextResponse.json(
        { message: "Ngày tháng không hợp lệ" },
        { status: 400 }
      );
    }

    // First, get the current LichLamViec to find its CaLamViec
    const currentLichLamViec = await prisma.lichLamViec.findUnique({
      where: { idLichLamViec: lichLamViecId },
      include: { caLamViec: true },
    });

    if (!currentLichLamViec) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch làm việc" },
        { status: 404 }
      );
    }

    // Update or create CaLamViec
    let caLamViecId = currentLichLamViec.idCaLamViec;

    if (caLamViecId) {
      // Update existing CaLamViec
      await prisma.caLamViec.update({
        where: { idCaLamViec: caLamViecId },
        data: {
          idUsers: Number(idUsers),
          ngaylam: ngayLamViecDate,
          giobatdau: GioBatDau,
          gioketthuc: GioKetThuc,
        },
      });
    } else {
      // Create new CaLamViec if it doesn't exist
      const newCaLamViec = await prisma.caLamViec.create({
        data: {
          idUsers: Number(idUsers),
          ngaylam: ngayLamViecDate,
          giobatdau: GioBatDau,
          gioketthuc: GioKetThuc,
        },
      });
      caLamViecId = newCaLamViec.idCaLamViec;
    }

    // Update LichLamViec
    const updatedLichLamViec = await prisma.lichLamViec.update({
      where: {
        idLichLamViec: lichLamViecId,
      },
      data: {
        idUsers: Number(idUsers),
        NgayLamViec: ngayLamViecDate,
        GioBatDau: gioBatDauDate,
        GioKetThuc: gioKetThucDate,
        DiaDiem,
        idCaLamViec: caLamViecId,
      },
      include: {
        user: true,
        caLamViec: true,
      },
    });

    // Create notification for updated work schedule
    const notification = await prisma.notification.create({
      data: {
        idUsers: Number(idUsers),
        title: "Cập nhật lịch làm việc",
        message: `Lịch làm việc của bạn đã được cập nhật: Ngày ${ngayLamViecDate.toLocaleDateString(
          "vi-VN"
        )} từ ${GioBatDau} đến ${GioKetThuc}${
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

    return NextResponse.json(
      {
        data: updatedLichLamViec,
        message: "Cập nhật lịch làm việc thành công",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi cập nhật lịch làm việc:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const lichLamViecId = Number(id);

  if (isNaN(lichLamViecId)) {
    return NextResponse.json(
      { error: "ID lịch làm việc không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const lichLamViec = await prisma.lichLamViec.findUnique({
      where: { idLichLamViec: lichLamViecId },
      include: { user: true, caLamViec: true },
    });

    if (!lichLamViec) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch làm việc" },
        { status: 404 }
      );
    }

    // Start a transaction to delete both records
    await prisma.$transaction([
      // First delete the LichLamViec record
      prisma.lichLamViec.delete({
        where: { idLichLamViec: lichLamViecId },
      }),
      // Then delete the associated CaLamViec if it exists
      ...(lichLamViec.idCaLamViec
        ? [
            prisma.caLamViec.delete({
              where: { idCaLamViec: lichLamViec.idCaLamViec },
            }),
          ]
        : []),
    ]);

    // Create notification for deleted work schedule
    const notification = await prisma.notification.create({
      data: {
        idUsers: lichLamViec.idUsers,
        title: "Hủy lịch làm việc",
        message: `Lịch làm việc ngày ${lichLamViec.NgayLamViec.toLocaleDateString(
          "vi-VN"
        )} đã bị hủy`,
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
      { message: "Xoá lịch làm việc thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
