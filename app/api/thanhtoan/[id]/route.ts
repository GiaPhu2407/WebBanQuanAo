import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idthanhtoan = parseInt(params.id, 10);

  if (isNaN(idthanhtoan)) {
    return NextResponse.json(
      { message: "ID thanh toán không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const existingThanhToan = await prisma.thanhtoan.findUnique({
      where: { idthanhtoan },
    });

    if (!existingThanhToan) {
      return NextResponse.json(
        { message: "Thanh toán không tồn tại" },
        { status: 404 }
      );
    }

    await prisma.thanhtoan.delete({ where: { idthanhtoan } });

    return NextResponse.json(
      { message: "Thanh toán đã được xóa" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi xóa thanh toán" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const idThanhToan = parseInt(params.id);

    const updatedPayment = await prisma.thanhtoan.update({
      where: { idthanhtoan: idThanhToan },
      data: {
        iddonhang: body.iddonhang,
        phuongthucthanhtoan: body.phuongthucthanhtoan,
        sotien: body.sotien,
        trangthai: body.trangthai,
        ngaythanhtoan: body.ngaythanhtoan ? new Date(body.ngaythanhtoan) : null,
      },
    });

    return NextResponse.json({
      payment: updatedPayment,
      message: "Cập nhật thanh toán thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idthanhtoan = parseInt(params.id, 10);

  if (isNaN(idthanhtoan)) {
    return NextResponse.json(
      { message: "ID thanh toán không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const thanhToan = await prisma.thanhtoan.findUnique({
      where: { idthanhtoan },
    });

    if (!thanhToan) {
      return NextResponse.json(
        { message: "Thanh toán không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        payment: thanhToan,
        message: "Lấy thông tin thanh toán thành công",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy thông tin thanh toán" },
      { status: 500 }
    );
  }
}
// import { deletePayment, updatePayment } from "@/app/component/Order/services/payment";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const result = await deletePayment(params.id);
//     return NextResponse.json(result);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Có lỗi xảy ra khi xóa thanh toán" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const result = await updatePayment(params.id, body);
//     return NextResponse.json(result);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }
