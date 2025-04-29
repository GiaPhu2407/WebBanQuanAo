import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Assuming admin ID is 1, adjust as needed
    const adminId = 1;

    const id = Number.parseInt(params.id);
    const body = await request.json();

    const notification = await prisma.notification.findUnique({
      where: { idNotification: id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Thông báo không tồn tại" },
        { status: 404 }
      );
    }

    if (notification.idUsers !== adminId) {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật thông báo này" },
        { status: 403 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: { idNotification: id },
      data: { isRead: body.isRead },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating admin notification:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật thông báo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Assuming admin ID is 1, adjust as needed
    const adminId = 1;

    const id = Number.parseInt(params.id);

    const notification = await prisma.notification.findUnique({
      where: { idNotification: id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Thông báo không tồn tại" },
        { status: 404 }
      );
    }

    if (notification.idUsers !== adminId) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa thông báo này" },
        { status: 403 }
      );
    }

    await prisma.notification.delete({
      where: { idNotification: id },
    });

    // Notify clients about the deletion
    await pusherServer.trigger("admin-notifications", "delete-notification", {
      idNotification: id,
    });

    return NextResponse.json({ message: "Đã xóa thông báo thành công" });
  } catch (error) {
    console.error("Error deleting admin notification:", error);
    return NextResponse.json(
      { error: "Không thể xóa thông báo" },
      { status: 500 }
    );
  }
}
