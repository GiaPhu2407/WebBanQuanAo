 
import { CartItem } from "@/lib/cart";
import { calculateDeliveryDate } from "../utils/date";
import prisma from "@/prisma/client";

// / Convert large VND amounts to a smaller unit (divide by 1000)
function normalizeAmount(amount: number): number {
    // Ensure the result is within safe integer limits
    const normalized = Math.floor(amount / 100000);
    if (normalized > 2147483647) { // MAX_INT
      throw new Error("Total amount exceeds maximum allowed value");
    }
    return normalized;
  }
  
  export async function createOrder(userId: number, item: CartItem, paymentMethod: string) {
    try {
      // Normalize prices to stay within INT limits
      const unitPrice = normalizeAmount(item.sanpham.gia);
      const totalAmount = unitPrice * item.soluong;
  
      const order = await prisma.donhang.create({
        data: {
          idUsers: userId,
          ngaydat: new Date(),
          trangthai: paymentMethod === "stripe" ? "Đã xác nhận" : "Chờ xác nhận",
          tongsotien: totalAmount,
          tongsoluong: item.soluong,
        },
      });
  
      await prisma.chitietDonhang.create({
        data: {
          iddonhang: order.iddonhang,
          idsanpham: item.idsanpham,
          idSize: item.idSize,
          soluong: item.soluong,
          dongia: unitPrice,
        },
      });
  
      await prisma.thanhtoan.create({
        data: {
          iddonhang: order.iddonhang,
          phuongthucthanhtoan: paymentMethod,
          sotien: totalAmount,
          trangthai: paymentMethod === "stripe" ? "Đã thanh toán" : "Đang xử lý",
          ngaythanhtoan: new Date(),
        },
      });
  
      await prisma.lichGiaoHang.create({
        data: {
          iddonhang: order.iddonhang,
          idsanpham: item.idsanpham,
          idKhachHang: userId,
          NgayGiao: calculateDeliveryDate(),
          TrangThai: "Chờ giao",
        },
      });
  
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }