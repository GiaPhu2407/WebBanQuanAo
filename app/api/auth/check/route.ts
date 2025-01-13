// app/api/auth/check/route.ts
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";     // Điều chỉnh import theo setup của bạn
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json({
      idUsers: session.user.idUsers,
      // Thêm các thông tin user khác nếu cần
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
