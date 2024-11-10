// utils/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Interfaces
interface RegisterCustomerDto {
  hoten: string;
  sodienthoai: string;
  email: string;
  gioitinh?: boolean;
  diachi?: string;
  ngaysinh?: Date;
  tendangnhap: string;
  matkhau: string;
}

interface RegisterStaffDto {
  tennhanvien: string;
  sodienthoai: string;
  email: string;
  gioitinh?: boolean;
  ngaysinh?: Date;
  diachi?: string;
  ngayvaolam?: Date;
  username: string;
  pasword: string;
  idrolenhanvien?: number;
}

// Authentication Service
export class AuthService {
  // Đăng ký tài khoản khách hàng
  async registerCustomer(data: RegisterCustomerDto) {
    const existingUser = await prisma.khachhang.findFirst({
      where: {
        OR: [{ email: data.email }, { tendangnhap: data.tendangnhap }],
      },
    });

    if (existingUser) {
      throw new Error("Email hoặc tên đăng nhập đã tồn tại");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.matkhau, 10);

    // Tạo khách hàng mới
    const customer = await prisma.khachhang.create({
      data: {
        ...data,
        matkhau: hashedPassword,
        idrolekhachhang: 1, // Role mặc định cho khách hàng
      },
    });

    // Tạo admin account cho khách hàng
    await prisma.admin.create({
      data: {
        idkhachhang: customer.idkhachhang,
        username: data.tendangnhap,
        pasword: hashedPassword,
        idroleAdmin: 1, // Role mặc định cho khách hàng
      },
    });

    return { message: "Đăng ký thành công!" };
  }

  // Đăng ký tài khoản nhân viên
  async registerStaff(data: RegisterStaffDto) {
    const existingStaff = await prisma.nhanvien.findFirst({
      where: {
        OR: [{ email: data.email }, { sodienthoai: data.sodienthoai }],
      },
    });

    if (existingStaff) {
      throw new Error("Email hoặc số điện thoại đã tồn tại");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.pasword, 10);

    // Tạo nhân viên mới
    const staff = await prisma.nhanvien.create({
      data: {
        tennhanvien: data.tennhanvien,
        sodienthoai: data.sodienthoai,
        email: data.email,
        gioitinh: data.gioitinh,
        ngaysinh: data.ngaysinh,
        diachi: data.diachi,
        ngayvaolam: data.ngayvaolam,
        idrolenhanvien: data.idrolenhanvien || 2, // Role mặc định cho nhân viên
      },
    });

    // Tạo admin account cho nhân viên
    await prisma.admin.create({
      data: {
        idnhanvien: staff.idNhanvien,
        username: data.username,
        pasword: hashedPassword,
        idroleAdmin: 2, // Role mặc định cho nhân viên
      },
    });

    return { message: "Đăng ký nhân viên thành công!" };
  }

  // Đăng nhập
  async login(username: string, password: string) {
    // Tìm admin account
    const admin = await prisma.admin.findFirst({
      where: { username },
      include: {
        nhanvien: true,
        khachhang: true,
        role: true,
      },
    });

    if (!admin) {
      throw new Error("Tài khoản không tồn tại");
    }

    // Kiểm tra mật khẩu
    const passwordValid = await bcrypt.compare(password, admin.pasword!);
    if (!passwordValid) {
      throw new Error("Mật khẩu không chính xác");
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: admin.idadmin,
        role: admin.role?.idrole,
        isStaff: !!admin.idnhanvien,
        isCustomer: !!admin.idkhachhang,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: admin.idadmin,
        role: admin.role,
        staffInfo: admin.nhanvien,
        customerInfo: admin.khachhang,
      },
    };
  }
}

// Middleware để xác thực JWT token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token xác thực" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền
export const checkRole = (allowedRoles: number[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};
