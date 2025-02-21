// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// // Kiểm tra và sử dụng biến môi trường
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET() {
//   try {
//     const { data, error } = await supabase
//       .from("notifications")
//       .select("*")
//       .order("timestamp", { ascending: false });

//     if (error) {
//       console.error("Supabase error:", error);
//       throw error;
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch notifications" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { customerId, customerName, orderId, message } = body;

//     // Validate required fields
//     if (!customerId || !customerName || !orderId || !message) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const { data, error } = await supabase
//       .from("notifications")
//       .insert([
//         {
//           customerId,
//           customerName,
//           orderId,
//           message,
//           isRead: false,
//           timestamp: new Date().toISOString(), // Thêm timestamp
//         },
//       ])
//       .select();

//     if (error) {
//       // Log chi tiết hơn về lỗi
//       console.error("Supabase insertion error:", {
//         error,
//         requestBody: body,
//       });
//       throw error;
//     }

//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     // Trả về thông tin lỗi chi tiết hơn
//     return NextResponse.json(
//       {
//         error: "Failed to create notification",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Server as SocketIO } from "socket.io";
import { Server as HTTPServer } from "http";
import { NextApiResponse } from "next";

let io: SocketIO | null = null; // Tránh tạo nhiều instance

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const headersList = headers();
    const socketPath = headersList.get("socket-path") || "/api/socket";

    // Kiểm tra dữ liệu đầu vào
    if (!body.orderId || !body.customerName || !body.amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Tạo payload thông báo
    const notification = {
      orderId: body.orderId,
      customerName: body.customerName,
      amount: body.amount,
      timestamp: new Date().toISOString(),
      status: body.status || "completed",
      message: `New payment received from ${body.customerName}`,
    };

    // Kiểm tra nếu io chưa được khởi tạo
    if (!io) {
      const httpServer = new HTTPServer();
      io = new SocketIO(httpServer, {
        path: socketPath,
        cors: { origin: "*" }, // CORS cho phép mọi nguồn
      });
    }

    // Emit sự kiện đến tất cả client đã kết nối
    io.emit("newPayment", notification);

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Socket API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
