import { z } from "zod";

export const LoginFormSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(2, { message: "Tên đăng nhập hoặc email phải có ít nhất 2 ký tự" })
    .trim(),
  password: z.string().min(4, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
});
export default LoginFormSchema;
