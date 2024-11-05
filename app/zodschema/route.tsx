import { z } from "zod"; // Để validation

// Schema validation cho sản phẩm
export const ProductSchema = z.object({
  tensanpham: z.string().min(8, "Tên sản phẩm không được để trống"),
  mota: z.string().optional(),
  gia: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Giá không được âm")
  ), // Chuyển chuỗi thành số
  hinhanh: z.string().optional(),
  idloaisanpham: z.number(),
  giamgia: z.number().min(0).max(100).optional(),
});

const UserSchema = z.object({
  // email: z.string().email({ message: "Email khong hop le" }),
  tenloai: z
    .string()
    .min(8, { message: "Ten phai dai hon 8 ky tu" })
    .max(255, { message: "Ten khong duoc dai qua 255 ky tu" }),
  mota: z
    .string()
    .min(8, { message: "Ten phai dai hon 8 ky tu" })
    .max(255, { message: "Ten khong duoc dai qua 255 ky tu" }),
});
export default UserSchema;

export const SupplierSchema = z.object({
  id: z.number().optional(), // ID là tùy chọn nếu không dùng trong create
  tennhacungcap: z.string().min(1, "Tên nhà cung cấp không được để trống"),
  sodienthoai: z.string().min(1, "Số điện thoại không được để trống"),
  diachi: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  trangthai: z.boolean(), // true cho "Đang cung cấp", false cho "Ngừng cung cấp"
});
