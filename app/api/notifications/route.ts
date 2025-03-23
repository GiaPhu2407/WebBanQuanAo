import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        idUsers: session.idUsers,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Lấy 50 thông báo mới nhất
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUsers, title, message, type } = body;

    const notification = await prisma.notification.create({
      data: {
        idUsers,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date(),
      },
    });

    // Trigger real-time notification
    await pusherServer.trigger(
      "notifications",
      "new-notification",
      notification
    );

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: {
        idUsers: session.idUsers,
      },
    });

    // Trigger real-time update
    await pusherServer.trigger("notifications", "clear-all-notifications", {
      idUsers: session.idUsers,
    });

    return NextResponse.json({
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
