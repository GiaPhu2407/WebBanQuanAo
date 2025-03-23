import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function GET() {
  try {
    const lichLamViec = await prisma.lichLamViec.findMany({
      include: {
        user: {
          select: {
            idUsers: true,
            Tentaikhoan: true,
            Hoten: true,
            Email: true,
            idRole: true,
          },
        },
        caLamViec: true, // Include caLamViec data
      },
      orderBy: {
        NgayLamViec: "asc",
      },
    });

    return NextResponse.json({
      data: lichLamViec,
      message: "Lấy danh sách lịch làm việc thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách lịch làm việc:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách lịch làm việc" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUsers, NgayLamViec, GioBatDau, GioKetThuc, DiaDiem } = body;

    console.log("Received data:", body);

    // Validation
    if (!idUsers || !NgayLamViec || !GioBatDau || !GioKetThuc) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Kiểm tra user có tồn tại và có phải là nhân viên không
    const user = await prisma.users.findFirst({
      where: {
        idUsers: Number(idUsers),
        idRole: 3,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Không tìm thấy nhân viên hoặc người dùng không phải là nhân viên",
        },
        { status: 400 }
      );
    }

    // Format dates
    const formattedNgayLamViec = new Date(NgayLamViec);
    const formattedGioBatDau = new Date(`${NgayLamViec}T${GioBatDau}`);
    const formattedGioKetThuc = new Date(`${NgayLamViec}T${GioKetThuc}`);

    // First create CaLamViec
    const caLamViec = await prisma.caLamViec.create({
      data: {
        idUsers: Number(idUsers),
        ngaylam: formattedNgayLamViec,
        giobatdau: GioBatDau,
        gioketthuc: GioKetThuc,
      },
    });

    // Then create LichLamViec with reference to CaLamViec
    const newLichLamViec = await prisma.lichLamViec.create({
      data: {
        idUsers: Number(idUsers),
        NgayLamViec: formattedNgayLamViec,
        GioBatDau: formattedGioBatDau,
        GioKetThuc: formattedGioKetThuc,
        DiaDiem: DiaDiem || "",
        idCaLamViec: caLamViec.idCaLamViec, // Link to the created CaLamViec
      },
      include: {
        user: {
          select: {
            idUsers: true,
            Tentaikhoan: true,
            Hoten: true,
            Email: true,
            idRole: true,
          },
        },
        caLamViec: true,
      },
    });

    // Create notification for the new work schedule
    const notification = await prisma.notification.create({
      data: {
        idUsers: Number(idUsers),
        title: "Lịch làm việc mới",
        message: `Bạn có lịch làm việc mới vào ngày ${formattedNgayLamViec.toLocaleDateString(
          "vi-VN"
        )} từ ${GioBatDau} đến ${GioKetThuc}${
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

    console.log("Created lichLamViec:", newLichLamViec);

    return NextResponse.json({
      data: newLichLamViec,
      message: "Thêm lịch làm việc thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi thêm lịch làm việc:", error);
    return NextResponse.json(
      { error: `Lỗi khi thêm lịch làm việc: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Delete all LichLamViec records first
    await prisma.lichLamViec.deleteMany();
    // Then delete all CaLamViec records
    await prisma.caLamViec.deleteMany();

    return NextResponse.json({
      message: "Xoá tất cả lịch làm việc thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi xoá lịch làm việc:", error);
    return NextResponse.json(
      { error: `Lỗi khi xoá lịch làm việc: ${error.message}` },
      { status: 500 }
    );
  }
}
