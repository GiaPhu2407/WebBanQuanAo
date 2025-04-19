// import prisma from "@/prisma/client";
// import { compare, hash } from "bcryptjs";
// import { log } from "console";
// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";

// const secretKey = process.env.JWT_SECRET_KEY;
// const key = new TextEncoder().encode(secretKey);

// export async function signUp(
//   email: string,
//   username: string,
//   password: string,
//   fullName?: string,
//   phone?: string,
//   address?: string,
//   avatar?: string
// ) {
//   try {
//     // Check if user already exists
//     const existingUser = await prisma.users.findFirst({
//       where: {
//         OR: [{ Email: email }, { Tentaikhoan: username }],
//       },
//     });

//     if (existingUser) {
//       throw new Error("Email or username already exists");
//     }

//     // Validate address length
//     if (address && address.length > 255) {
//       throw new Error("Address is too long");
//     }

//     // Hash password
//     const hashedPassword = await hash(password, 12);

//     // First, ensure the default role exists
//     const defaultRole = await prisma.role.upsert({
//       where: { idrole: 1 },
//       update: {},
//       create: {
//         idrole: 1,
//         Tennguoidung: "KhachHang",
//       },
//     });

//     // Create the user with the confirmed default role
//     const user = await prisma.users.create({
//       data: {
//         Email: email,
//         Tentaikhoan: username,
//         Matkhau: hashedPassword,
//         Hoten: fullName || "",
//         Sdt: phone || "",
//         Diachi: address || "",
//         avatar: avatar || null, // Make sure avatar is stored
//         idRole: defaultRole.idrole,
//         Ngaydangky: new Date(),
//       },
//       select: {
//         idUsers: true,
//         Email: true,
//         Tentaikhoan: true,
//         Hoten: true,
//         idRole: true,
//         avatar: true, // Include avatar in the returned data
//         role: {
//           select: {
//             Tennguoidung: true,
//           },
//         },
//       },
//     });
//     console.log(user);

//     return user;
//   } catch (error: any) {
//     console.error("Signup error:", error);

//     // Handle specific Prisma error codes
//     if (error.code === "P2000") {
//       throw new Error("One or more fields exceed maximum length");
//     }

//     if (error.code === "P2002") {
//       if (error.meta?.target?.includes("Email")) {
//         throw new Error("Email already in use");
//       }
//       if (error.meta?.target?.includes("Tentaikhoan")) {
//         throw new Error("Username already in use");
//       }
//       throw new Error("Registration failed: Duplicate value");
//     }

//     if (error.code === "P2003") {
//       throw new Error("Invalid role assignment");
//     }

//     throw new Error("Registration failed. Please try again.");
//   }
// }

// export async function login(usernameOrEmail: string, password: string) {
//   try {
//     // Find user by username or email
//     const user = await prisma.users.findFirst({
//       where: {
//         OR: [{ Email: usernameOrEmail }, { Tentaikhoan: usernameOrEmail }],
//       },
//       include: {
//         role: {
//           select: {
//             Tennguoidung: true,
//           },
//         },
//       },
//     });

//     if (!user || !user.Matkhau) {
//       throw new Error("User not found");
//     }

//     // Verify password
//     const isValid = await compare(password, user.Matkhau);
//     if (!isValid) {
//       throw new Error("Invalid password");
//     }

//     // Create session token
//     const token = await new SignJWT({
//       idUsers: user.idUsers,
//       email: user.Email,
//       role: user.role?.Tennguoidung,
//       name: user.Hoten,
//       avatar: user.avatar, // Include avatar in the JWT token
//     })
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("24h")
//       .sign(key);

//     // Set cookie
//     (
//       await // Set cookie
//       cookies()
//     ).set("session-token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 86400, // 24 hours
//     });

//     return {
//       idUsers: user.idUsers,
//       email: user.Email,
//       username: user.Tentaikhoan,
//       fullName: user.Hoten,
//       role: user.role?.Tennguoidung,
//       avatar: user.avatar, // Include avatar in the returned data
//     };
//   } catch (error) {
//     console.error("Login error:", error);
//     throw new Error("Authentication failed");
//   }
// }

// export async function logout() {
//   (await cookies()).delete("session-token");
// }

// export async function getSession(request: unknown) {
//   try {
//     const token = (await cookies()).get("session-token")?.value;
//     if (!token) return null;

//     const verified = await jwtVerify(token, key);
//     return verified.payload as any;
//   } catch (error) {
//     return null;
//   }
// }

// export async function changePassword(
//   userId: number,
//   oldPassword: string,
//   newPassword: string
// ) {
//   try {
//     // 1. Tìm người dùng dựa trên `userId`
//     const user = await prisma.users.findUnique({
//       where: { idUsers: userId },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // 2. Kiểm tra mật khẩu cũ
//     const isOldPasswordValid = await compare(oldPassword, user.Matkhau!);
//     if (!isOldPasswordValid) {
//       throw new Error("Old password is incorrect");
//     }

//     // 3. Mã hóa mật khẩu mới
//     const hashedNewPassword = await hash(newPassword, 12);

//     // 4. Cập nhật mật khẩu mới
//     await prisma.users.update({
//       where: { idUsers: userId },
//       data: { Matkhau: hashedNewPassword },
//     });

//     return {
//       success: true,
//       message: "Password changed successfully",
//     };
//   } catch (error: any) {
//     console.error("Change password error:", error);
//     throw new Error(error.message || "Failed to change password");
//   }
// }
import prisma from "@/prisma/client";
import { compare, hash } from "bcryptjs";
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
  address?: string,
  avatar?: string
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
        avatar: avatar || null,
        idRole: defaultRole.idrole,
        Ngaydangky: new Date(),
      },
      select: {
        idUsers: true,
        Email: true,
        Tentaikhoan: true,
        Hoten: true,
        idRole: true,
        avatar: true,
        role: {
          select: {
            Tennguoidung: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Signup error:", error);

      // Handle specific Prisma error codes
      if ("code" in error && typeof error.code === "string") {
        if (error.code === "P2000") {
          throw new Error("One or more fields exceed maximum length");
        }

        if (error.code === "P2002") {
          const meta = (error as { meta?: { target?: string[] } }).meta;
          if (meta?.target?.includes("Email")) {
            throw new Error("Email already in use");
          }
          if (meta?.target?.includes("Tentaikhoan")) {
            throw new Error("Username already in use");
          }
          throw new Error("Registration failed: Duplicate value");
        }

        if (error.code === "P2003") {
          throw new Error("Invalid role assignment");
        }
      }
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
      avatar: user.avatar,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(key);

    // Set cookie
    const cookieStore = cookies();
    (await cookieStore).set("session-token", token, {
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
      avatar: user.avatar,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login error:", error);
    }
    throw new Error("Authentication failed");
  }
}

export async function logout() {
  const cookieStore = cookies();
  (await cookieStore).delete("session-token");
}

interface SessionPayload {
  idUsers: number;
  email: string;
  role: string;
  name: string;
  avatar?: string;
}

export async function getSession(req: Request): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("session-token")?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, key);
    return verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  try {
    const user = await prisma.users.findUnique({
      where: { idUsers: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isOldPasswordValid = await compare(oldPassword, user.Matkhau!);
    if (!isOldPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    const hashedNewPassword = await hash(newPassword, 12);

    await prisma.users.update({
      where: { idUsers: userId },
      data: { Matkhau: hashedNewPassword },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Change password error:", error);
      throw new Error(error.message);
    }
    throw new Error("Failed to change password");
  }
}
