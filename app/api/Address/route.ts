import { getSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Get all addresses for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để truy cập địa chỉ" },
        { status: 401 }
      );
    }
    
    const addresses = await prisma.diaChi.findMany({
      where: {
        idUsers: session.idUsers,
      },
      orderBy: {
        macDinh: 'desc', // Default addresses first
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      addresses,
      message: "Lấy danh sách địa chỉ thành công" 
    });
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}

// Create a new address
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thêm địa chỉ" },
        { status: 401 }
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
      macDinh = false
    } = body;
    
    // Validate required fields
    if (!diaChiChiTiet || !thanhPho || !quanHuyen || !phuongXa || !soDienThoai || !tenNguoiNhan) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin địa chỉ" },
        { status: 400 }
      );
    }
    
    // If this is set as default, unset any existing default address
    if (macDinh) {
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
    
    // Create the new address
    const newAddress = await prisma.diaChi.create({
      data: {
        idUsers: session.idUsers,
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
      address: newAddress,
      message: "Thêm địa chỉ thành công"
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Lỗi khi thêm địa chỉ", details: error.message },
      { status: 500 }
    );
  }
}