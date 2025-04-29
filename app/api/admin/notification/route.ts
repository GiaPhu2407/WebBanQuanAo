import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Assuming admin ID is 1, adjust as needed
    // You might want to check if the user is an admin here
    const adminId = 1;

    const notifications = await prisma.notification.findMany({
      where: {
        idUsers: adminId,
        type: {
          startsWith: "admin_",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Get the 50 most recent notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, idDonhang, idThanhtoan } = body;

    // Assuming admin ID is 1, adjust as needed
    const adminId = 1;

    const notification = await prisma.notification.create({
      data: {
        idUsers: adminId,
        title,
        message,
        type: type.startsWith("admin_") ? type : `admin_${type}`,
        idDonhang,
        idThanhtoan,
        isRead: false,
        createdAt: new Date(),
      },
    });

    // Trigger real-time notification on admin channel
    await pusherServer.trigger(
      "admin-notifications",
      "new-notification",
      notification
    );

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error creating admin notification:", error);
    return NextResponse.json(
      { error: "Failed to create admin notification" },
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

    // Assuming admin ID is 1, adjust as needed
    const adminId = 1;

    await prisma.notification.deleteMany({
      where: {
        idUsers: adminId,
        type: {
          startsWith: "admin_",
        },
      },
    });

    // Trigger real-time update on admin channel
    await pusherServer.trigger(
      "admin-notifications",
      "clear-all-notifications",
      {
        idUsers: adminId,
      }
    );

    return NextResponse.json({
      message: "All admin notifications deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all admin notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete admin notifications" },
      { status: 500 }
    );
  }
}
