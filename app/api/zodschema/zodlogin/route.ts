import { z } from "zod";

// Tạo Zod schema cho thông tin đăng nhập
export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"), // Có thể là email hoặc username
  password: z.string().min(6, "Password must be at least 6 characters"), // Đảm bảo password có ít nhất 6 ký tự
});
