import prisma from "@/prisma/client";
import { compare, hash } from "bcryptjs";
import { log } from "console";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function signUp(
  email: string,
  username: string,
  password: string,
  fullName?: string,
  phone?: string,
  address?: string
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ Email: email }, { Tentaikhoan: username }],
      },
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    // Validate address length
    if (address && address.length > 255) {
      throw new Error("Address is too long");
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // First, ensure the default role exists
    const defaultRole = await prisma.role.upsert({
      where: { idrole: 1 },
      update: {},
      create: {
        idrole: 1,
        Tennguoidung: "KhachHang",
      },
    });

    // Create the user with the confirmed default role
    const user = await prisma.users.create({
      data: {
        Email: email,
        Tentaikhoan: username,
        Matkhau: hashedPassword,
        Hoten: fullName || "",
        Sdt: phone || "",
        Diachi: address || "",
        idRole: defaultRole.idrole,
        Ngaydangky: new Date(),
      },
      select: {
        idUsers: true,
        Email: true,
        Tentaikhoan: true,
        Hoten: true,
        idRole: true,
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });
    console.log(user);

    return user;
  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle specific Prisma error codes
    if (error.code === "P2000") {
      throw new Error("One or more fields exceed maximum length");
    }

    if (error.code === "P2002") {
      if (error.meta?.target?.includes("Email")) {
        throw new Error("Email already in use");
      }
      if (error.meta?.target?.includes("Tentaikhoan")) {
        throw new Error("Username already in use");
      }
      throw new Error("Registration failed: Duplicate value");
    }

    if (error.code === "P2003") {
      throw new Error("Invalid role assignment");
    }

    throw new Error("Registration failed. Please try again.");
  }
}

export async function login(usernameOrEmail: string, password: string) {
  try {
    // Find user by username or email
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ Email: usernameOrEmail }, { Tentaikhoan: usernameOrEmail }],
      },
      include: {
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });

    if (!user || !user.Matkhau) {
      throw new Error("User not found");
    }

    // Verify password
    const isValid = await compare(password, user.Matkhau);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // Create session token
    const token = await new SignJWT({
      idUsers: user.idUsers,
      email: user.Email,
      role: user.role?.Tennguoidung,
      name: user.Hoten,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(key);

    // Set cookie
    cookies().set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    });

    return {
      idUsers: user.idUsers,
      email: user.Email,
      username: user.Tentaikhoan,
      fullName: user.Hoten,
      role: user.role?.Tennguoidung,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Authentication failed");
  }
}
export async function logout() {
  cookies().delete("session-token");
}

export async function getSession() {
  try {
    const token = cookies().get("session-token")?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, key);
    return verified.payload as any;
  } catch (error) {
    return null;
  }
}
