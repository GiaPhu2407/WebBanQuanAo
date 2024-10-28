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
