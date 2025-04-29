import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const id = params.id;
    const idDiaChi = Number.parseInt(id);

    if (isNaN(idDiaChi)) {
      return NextResponse.json(
        { error: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    const address = await prisma.diaChi.findUnique({
      where: { idDiaChi },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ address });
  } catch (error: any) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}

// Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDiaChi = parseInt(params.id);

    if (isNaN(idDiaChi)) {
      return NextResponse.json(
        { error: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    // Verify user has access to this address
    const session = await getSession(request);
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const existingAddress = await prisma.diaChi.findUnique({
      where: { idDiaChi },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Ensure user can only update their own addresses
    if (existingAddress.idUsers !== session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền chỉnh sửa địa chỉ này" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      diaChiChiTiet,
      thanhPho,
      quanHuyen,
      phuongXa,
      soDienThoai,
      tenNguoiNhan,
      macDinh = false,
    } = body;

    // If this is set as default, unset any existing default address
    if (macDinh && !existingAddress.macDinh) {
      await prisma.diaChi.updateMany({
        where: {
          idUsers: session.idUsers,
          macDinh: true,
        },
        data: {
          macDinh: false,
        },
      });
    }

    // Update the address
    const updatedAddress = await prisma.diaChi.update({
      where: { idDiaChi },
      data: {
        diaChiChiTiet,
        thanhPho,
        quanHuyen,
        phuongXa,
        soDienThoai,
        tenNguoiNhan,
        macDinh,
      },
    });

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: "Cập nhật địa chỉ thành công",
    });
  } catch (error: any) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}

// Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDiaChi = parseInt(params.id);

    if (isNaN(idDiaChi)) {
      return NextResponse.json(
        { error: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    // Verify user has access to this address
    const session = await getSession(request);
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const existingAddress = await prisma.diaChi.findUnique({
      where: { idDiaChi },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Ensure user can only delete their own addresses
    if (existingAddress.idUsers !== session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền xóa địa chỉ này" },
        { status: 403 }
      );
    }

    // Check if this address is being used in any orders
    const ordersUsingAddress = await prisma.donhang.count({
      where: { idDiaChi },
    });

    if (ordersUsingAddress > 0) {
      return NextResponse.json(
        { error: "Không thể xóa địa chỉ đang được sử dụng trong đơn hàng" },
        { status: 400 }
      );
    }

    // Delete the address
    await prisma.diaChi.delete({
      where: { idDiaChi },
    });

    // If this was a default address, set another address as default
    if (existingAddress.macDinh) {
      const anotherAddress = await prisma.diaChi.findFirst({
        where: { idUsers: session.idUsers },
        orderBy: { created_at: "desc" },
      });

      if (anotherAddress) {
        await prisma.diaChi.update({
          where: { idDiaChi: anotherAddress.idDiaChi },
          data: { macDinh: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}

// Set an address as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDiaChi = parseInt(params.id);

    if (isNaN(idDiaChi)) {
      return NextResponse.json(
        { error: "ID địa chỉ không hợp lệ" },
        { status: 400 }
      );
    }

    // Verify user has access to this address
    const session = await getSession(request);
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const existingAddress = await prisma.diaChi.findUnique({
      where: { idDiaChi },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Ensure user can only update their own addresses
    if (existingAddress.idUsers !== session.idUsers) {
      return NextResponse.json(
        { error: "Không có quyền chỉnh sửa địa chỉ này" },
        { status: 403 }
      );
    }

    // First, unset all default addresses for this user
    await prisma.diaChi.updateMany({
      where: {
        idUsers: session.idUsers,
        macDinh: true,
      },
      data: {
        macDinh: false,
      },
    });

    // Then set this address as default
    const updatedAddress = await prisma.diaChi.update({
      where: { idDiaChi },
      data: {
        macDinh: true,
      },
    });

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: "Đặt địa chỉ mặc định thành công",
    });
  } catch (error: any) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Lỗi khi đặt địa chỉ mặc định", details: error.message },
      { status: 500 }
    );
  }
}
